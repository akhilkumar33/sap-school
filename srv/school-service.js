const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {

    const { Department } = this.entities;

    
    this.on("CreateDepartment", async (req) => {
    const { name } = req.data;

    if (!name) {
      req.error(400, "Project ID is required");
    } else {
        return { message: `Department '${name}' created successfullyyyyy!` };
        console.log("sucess");
        
    }
  });
});
