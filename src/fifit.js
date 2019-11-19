const parseString = require("xml2js").parseString;
const fs = require("fs");
const cTable = require("console.table");
var xml = fs.readFileSync(__dirname + "/ClassDiagram.xmi", "utf8");
const model = {};
parseString(xml, function(err, result) {
  const classes =
    result["xmi:XMI"]["uml:Model"][0].packagedElement[1].packagedElement[0]
      .packagedElement[0].packagedElement;

  classes.forEach(x => {
    let count = 0;
    if ("ownedMember" in x) {
      for (let j of x["ownedMember"]) {
        if (j["ownedEnd"][0]["$"].type != x["$"]["xmi:id"]) {
          if (j["ownedEnd"][0]["$"].aggregation == "none") {
            count = count + 1;
          }
        } else {
          if (j["ownedEnd"][1]["$"].aggregation == "none") {
            count = count + 1;
          }
        }
      }
      //   x["ownedMember"].forEach(j => {
      //     if(j["ownedEnd"][0])
      //     if (j["ownedEnd"][0]["$"].aggregation == "none") {
      //       count++;
      //     }
      //   });
    }
    model[x["$"].name] = count;
  });
});

console.table(model);
