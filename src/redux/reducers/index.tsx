import { combineReducers } from "redux";
import allEventsReducer from "./allEventsReducer";
import authreducers from "./authreducers";
import findFoodReducer from "./findFoodReducer";
import myEventReducer from "./myEventReducer";

const rootReducer = combineReducers({
  auth: authreducers,
  findFood:findFoodReducer,
  myEvent:myEventReducer,
  allEvents:allEventsReducer,
});

export default rootReducer;
