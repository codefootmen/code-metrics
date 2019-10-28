const parseString = require("xml2js").parseString;
const fs = require("fs");
const cTable = require("console.table");
var xml = fs.readFileSync(__dirname + "/model.xmi", "utf8");

let model = {};
parseString(xml, function(err, result) {
  const classes =
    result["xmi:XMI"]["uml:Model"][0]["packagedElement"][0]["packagedElement"];
  classes.forEach(x => {
    model[x["$"].name] = {
      ownedAttributes:
        "ownedAttribute" in x == true ? x["ownedAttribute"].length : 0,
      ownedMembers: "ownedMember" in x == true ? x["ownedMember"].length : 0,
      parents: "generalization" in x == true ? x["generalization"].length : 0
    };
  });
});

output = [];

Object.keys(model).forEach(x => {
  output.push({
    Name: x,
    WMC: 0,
    DIT: model[x].parents,
    NOC: 0,
    CBO: model[x].ownedMembers,
    CS: model[x].ownedAttributes,
    NOO: 0,
    NOA: 0
  });
});

console.table(output);
