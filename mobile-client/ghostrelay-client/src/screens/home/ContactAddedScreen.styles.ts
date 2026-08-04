import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

  container:{

    flex:1,

    justifyContent:"center",

    padding:24,

  },

  title:{

    color:Colors.text,

    fontSize:30,

    fontWeight:"700",

    textAlign:"center",

    marginTop:20,

  },

  subtitle:{

    color:Colors.textSecondary,

    textAlign:"center",

    marginTop:10,

    marginBottom:35,

    lineHeight:22,

  },

  contactCard:{

    backgroundColor:Colors.card,

    borderRadius:18,

    padding:20,

    marginBottom:30,

    borderWidth:1,

    borderColor:Colors.border,

  },

  contactName:{

    color:Colors.text,

    fontSize:20,

    fontWeight:"700",

    marginBottom:18,

  },

  fingerprintLabel:{

    color:Colors.primary,

    marginBottom:8,

    fontWeight:"600",

  },

  fingerprint:{

    color:Colors.textSecondary,

    fontSize:14,

  },

});