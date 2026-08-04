import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

  container: {

    flex:1,

    padding:22,

  },

  cameraPlaceholder:{

    flex:1,

    borderRadius:20,

    borderWidth:2,

    borderStyle:"dashed",

    borderColor:Colors.primary,

    justifyContent:"center",

    alignItems:"center",

    backgroundColor:Colors.card,

    marginBottom:30,

  },

  cameraText:{

    color:Colors.text,

    marginTop:20,

    fontSize:18,

    fontWeight:"600",

  },

  instructions:{

    color:Colors.textSecondary,

    textAlign:"center",

    marginBottom:30,

    lineHeight:22,

  },

});