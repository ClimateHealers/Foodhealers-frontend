import React, { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { localized } from "../locales/localization";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/reducers/langReducer";
import { styles } from "./Styles";

const Dropdown = () => {
  const [langOpen, setlangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [lang, setLang] = useState([
    { id: 1, label: "French", value: "fr" },
    { id: 2, label: "Hindi", value: "hi" },
    { id: 3, label: "Bengali", value: "be" },
    { id: 4, label: "Chinese", value: "ch" },
    { id: 5, label: "Mandarin", value: "ma" },
    { id: 6, label: "Punjabi", value: "pu" },
    { id: 7, label: "English", value: "en" },
    { id: 8, label: "Spanish", value: "es" },
  ]);

  const dispatch = useDispatch();
  const languageName = useSelector((state: any) => state.language);
  let selectedLang;
  const changeLanguage = (itemValue: any, index: any) => {
    selectedLang = lang[index].value;
    dispatch(setLanguage(selectedLang));
    localized.locale = selectedLang;
    setSelectedLanguage(selectedLang);
  };
  return (
    <SelectDropdown
      buttonStyle={styles.dropdown1BtnStyle}
      buttonTextStyle={styles.dropdown1BtnTxtStyle}
      renderDropdownIcon={() => {
        return (
          <MaterialIcons name="keyboard-arrow-down" size={18} color="#B50000" />
        );
      }}
      dropdownIconPosition={"right"}
      dropdownStyle={styles.dropdown1DropdownStyle}
      rowStyle={styles.dropdown1RowStyle}
      rowTextStyle={styles.dropdown1RowTxtStyle}
      data={lang && lang.map((dd) => dd.label)}
      onSelect={changeLanguage}
      defaultButtonText={selectedLanguage}
      buttonTextAfterSelection={(itemValue: any, index: any) => {
        return lang[index].value.toUpperCase();
      }}
      rowTextForSelection={(item: any, index: any) => {
        return item;
      }}
    />
  );
};

export default Dropdown;
