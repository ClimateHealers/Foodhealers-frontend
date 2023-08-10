import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { FlatList } from "react-native";
import { Text } from "react-native-paper";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import moment from "moment";
import { human, material, systemWeights } from "react-native-typography";

const NotificationFlatlist = ({ data }:any) => {
  const renderItem = ({ item }:any) => {
    return (
      <View>
        <View style={styles.item}>
          <MaterialIcon
            name={item.businessRuleViolated ? "warning" : "notifications-none"}
            color={
              item.businessRuleViolated
                ? item.businessRuleViolated.rule.rule_type === "violation"
                  ? "red"
                  : "#fabc6b"
                : "green"
            }
            size={30}
            style={{ marginRight: 10, flex: 0.5, alignSelf: "center" }}
          />
          <View style={{ flex: 4 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                display: "flex",
              }}>
              <Text style={[styles.cardText, { width: 150 }]} numberOfLines={1}>
                {item?.businessRuleViolated
                  ? item.businessRuleViolated.rule.title
                  : item.title}
              </Text>
              <Text style={styles.cardDate}>
                {moment(item.createdAt).format("DD-MMM-YY HH:mm")}
              </Text>
            </View>
            <Text style={styles.buttonContent}>
              {item?.businessRuleViolated
                ? item.businessRuleViolated.rule.errorMessage
                : item.message}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => (item._id ? item._id : item.id)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
  },
  cardTitle: {
    ...systemWeights.semibold,
  },
  cardText: {
    marginTop: 3,
    ...systemWeights.semibold,
    color: "black",
  },
  cardDate: {
    marginTop: 3,
    ...systemWeights.regular,
    // color: "black",
  },
  buttonContent: {
    paddingTop: 2,
    // color: "#696868",
    fontSize: 12,
  },
});
export default NotificationFlatlist;

