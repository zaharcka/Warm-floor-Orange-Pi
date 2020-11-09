import {Request, Response} from "express";
import DB from './DB';
import {Mode} from "./services/GPIO";

const GPIO = require('./services/GPIO');
const {Circuit} = require("./services/Circuit");


const express = require('express');
const app = express();

let { circuits } = DB;

const getCircuts = () => circuits;
const getCircut = (id: number) => getCircuts().filter(item => item.id === id)[0].pin;

circuits.forEach(circuit => {
    try {
        if (GPIO.isPinInitial(circuit.pinNumber)) {
            console.log(`Pin ${circuit.pinNumber} was busy. Try release.`);
            GPIO.release(circuit.pinNumber);
            console.log(`Release ${circuit.pinNumber}is OK`);
        }
        circuit.pin = new Circuit({
            pinNumber: circuit.pinNumber,
            mode: 'out',
            isOpen: true,
            name: circuit.name,
            NO: circuit.NO,
            LOW_LEVEL_RELAY: circuit.lowLevel,
        });
    }
        catch (e) {
            console.log('Error while initialisation Pin #', circuit.pinNumber);
        }
    }
);


app.get("/", function (request: Request, response: Response) {
    response.sendFile(__dirname+'/fe/index.html')
});

app.use('/close-circuit', (request: Request, response: Response) => {
    const { id } = request.query;
    const currentCircuit = circuits.find(item => item.id === Number(id));
    if (currentCircuit) {
        currentCircuit.pin.off();
        response.send(`closed`);
    } else {
        response.send("Sorry, but there is not circuit with this id");
    }
});

app.use('/open-circuit', (request: Request, response: Response) => {
    const { id } = request.query;
    const currentCircuit = circuits.find(item => item.id === Number(id));
    if (currentCircuit) {
        currentCircuit.pin.on();
        response.send(`opened>`);
    } else {
        response.send("Sorry, but there is not circuit with this id");
    }
});

app.use('/delete-circuit', (request: Request, response: Response) => {
    const { id } = request.query;
    const currentCircuit = circuits.find(item => item.id === Number(id));
    if (currentCircuit) {
        currentCircuit.pin.release();
        circuits = [...circuits.filter(item => item.id !== Number(id))];
        response.send(`deleted`);
    } else {
        response.send("Sorry, but there is not circuit with this id");
    }
});

app.use('/all-circuit', (request: Request, response: Response) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.send(circuits);
});

app.listen(3000, () => {
    console.log('HTTP-server start')
});



process.on('SIGINT', function () {
    circuits.forEach(item => {
        GPIO.release(item.pinNumber);
    });
    process.exit(2);
});
process.on('uncaughtException', function(e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    circuits.forEach(item => {
        GPIO.release(item.pinNumber);
    });
    process.exit(99);
});



