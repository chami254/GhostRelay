import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

  container:{

    flexDirection:"row",

    alignItems:"center",

    backgroundColor:Colors.card,

    borderRadius:14,

    paddingHorizontal:15,

    marginVertical:15,

    height:50,

    borderWidth:1,

    borderColor:Colors.border,

  },

  input:{

    flex:1,

    color:Colors.text,

    marginLeft:10,

    fontSize:15,

  },

});