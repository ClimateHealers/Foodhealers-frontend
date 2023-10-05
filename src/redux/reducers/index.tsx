import { combineReducers } from "redux";
import allEventsReducer from "./allEventsReducer";
import authreducers from "./authreducers";
import findFoodReducer from "./findFoodReducer";
import myEventReducer from "./myEventReducer";
import myDonations from "./myDonationsReducer";
import languageReducer from './langReducer'
import notificationReducer from "./notificationReducer";
import veganRecipesReducer from "./veganRecipesReducer";
import veganRecipesCategoryReducer from "./veganRecipesCategoryReducer";
import myDonationsReducer from "./myDonationsReducer";

const rootReducer = combineReducers({
  auth: authreducers,
  findFood:findFoodReducer,
  myEvent:myEventReducer,
  myDonations: myDonationsReducer,
  allEvents:allEventsReducer,
  language: languageReducer,
  notification:notificationReducer,
  recipesCategory:veganRecipesReducer,
  veganRecipesCategoryList: veganRecipesCategoryReducer
});

export default rootReducer;
