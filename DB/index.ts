import {Circuit} from "../services/Circuit";

type CircuitType = {
    id: number,
    pinNumber: number,
    pin?: Circuit,
}

let DB: {
   circuits: Array<CircuitType>,
} ;

DB = {
    circuits: [
        {
          id: 1,
          pinNumber: 6,
        },
    ]
};


export default DB;