"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const mercadopago_1 = __importDefault(require("mercadopago"));
mercadopago_1.default.configurations.setAccessToken(process.env.MERCADOPAGO_TOKEN);
const paymentsRoutes = (0, express_1.Router)();
exports.paymentsRoutes = paymentsRoutes;
const prisma = new client_1.PrismaClient();
paymentsRoutes.post("/card", (request, response) => {
    const { transaction_amount, token, description, installments, payment_method_id, issuer_id, payer, } = request.body;
    const payment_data = {
        transaction_amount,
        token,
        description,
        installments: Number(installments),
        payment_method_id,
        issuer_id,
        payer: {
            email: payer.email,
            identification: {
                type: payer.identification.type,
                number: payer.identification.number,
            },
        },
    };
    // create payment in gateway
    mercadopago_1.default.payment
        .save(payment_data)
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        // create record in database
        yield prisma.payments.create({
            data: {
                payment_id: res.body.id,
                price: transaction_amount,
                status: res.body.status,
                status_detail: res.body.status_detail,
            },
        });
        // response json user
        response.status(res.status).json({
            status: res.body.status,
            status_detail: res.body.status_detail,
            id: res.body.id,
        });
    }))
        .catch((err) => {
        response.status(400).json({
            message: err.message,
        });
    });
});
paymentsRoutes.post("/others", (request, response) => {
    const { transaction_amount, description, payment_method_id, payer } = request.body;
    const payment_data = {
        transaction_amount,
        description,
        payment_method_id,
        payer: {
            email: payer.email,
            first_name: payer.first_name,
            last_name: payer.last_name,
            identification: {
                type: payer.identification.type,
                number: payer.identification.number,
            },
        },
    };
    // create payment in gateway
    mercadopago_1.default.payment
        .create(payment_data)
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        if (payment_method_id === "pix") {
            // create record in database
            yield prisma.payments.create({
                data: {
                    payment_id: res.response.id,
                    price: transaction_amount,
                    status: res.response.status,
                    status_detail: res.response.status_detail,
                },
            });
            // response json user
            response.status(res.status).json({
                id: res.response.id,
                date_created: res.response.date_created,
                date_of_expiration: res.response.date_of_expiration,
                payment_method_id: res.response.payment_method_id,
                status: res.response.status,
                status_detail: res.response.status_detail,
                transaction_details: res.response.transaction_details,
                point_of_interaction: {
                    transaction_data: {
                        qr_code: res.response.point_of_interaction.transaction_data.qr_code,
                        qr_code_base64: res.response.point_of_interaction.transaction_data
                            .qr_code_base64,
                        ticket_url: res.response.point_of_interaction.transaction_data.ticket_url,
                    },
                },
            });
            return;
        }
        // create record in database
        yield prisma.payments.create({
            data: {
                payment_id: res.response.id,
                price: transaction_amount,
                status: res.response.status,
                status_detail: res.response.status_detail,
            },
        });
        // response json user
        response.status(res.status).json({
            id: res.response.id,
            date_created: res.response.date_created,
            date_of_expiration: res.response.date_of_expiration,
            payment_method_id: res.response.payment_method_id,
            status: res.response.status,
            status_detail: res.response.status_detail,
            transaction_details: res.response.transaction_details,
            barcode: res.response.barcode.content,
        });
    }))
        .catch((err) => {
        response.status(400).json({ message: err.message });
    });
});
