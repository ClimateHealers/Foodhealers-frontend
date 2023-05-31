import { combineReducers } from "redux";
import { findFood } from "../actions/findFoodaction";
import authreducers from "./authreducers";
import findFoodReducer from "./findFoodReducer";

const rootReducer = combineReducers({
  auth: authreducers,
  findFood:findFoodReducer
});

export default rootReducer;
