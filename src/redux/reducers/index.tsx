import { combineReducers } from "redux";
import allEventsReducer from "./allEventsReducer";
import authreducers from "./authreducers";
import findFoodReducer from "./findFoodReducer";
import myEventReducer from "./myEventReducer";
import languageReducer from "./langReducer";

const rootReducer = combineReducers({
  auth: authreducers,
  findFood:findFoodReducer,
  myEvent:myEventReducer,
  allEvents:allEventsReducer,
  language:languageReducer
});

export default rootReducer;
