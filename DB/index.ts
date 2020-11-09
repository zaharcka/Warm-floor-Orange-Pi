import {Circuit} from "../services/Circuit";

type CircuitType = {
    id: number,
    pinNumber: number,
    pin?: Circuit,
    name?: string,
    NO: boolean,
    lowLevel: boolean,
}

let DB: {
   circuits: Array<CircuitType>,
} ;

DB = {
    circuits: [
        {
          id: 1,
          pinNumber: 6,
          name: 'Детская, 1 контур',
          NO: true,
          lowLevel: true,
        },
        {
          id: 2,
          pinNumber: 5,
          name: 'Детская, 2 контур',
          NO: true,
          lowLevel: true,
        },
    ]
};


export default DB;