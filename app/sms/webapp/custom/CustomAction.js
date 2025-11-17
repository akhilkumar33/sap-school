sap.ui.define([
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/SearchField",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/VBox"
], function (Dialog, DialogType, Button, ButtonType, Column, ColumnListItem, Text, SearchField, JSONModel, MessageToast, MessageBox, Input, Label, VBox) {
    "use strict";

    return {

        sort: function () {
            sap.ui.core.BusyIndicator.show(0);

           
            jQuery.ajax({
                url: "/odata/v4/school/Department",
                type: "GET",
                contentType: "application/json",
                success: function (data) {
                    sap.ui.core.BusyIndicator.hide();

                    if (!data.value || data.value.length === 0) {
                        MessageToast.show("No departments found!");
                        return;
                    }

               
                    data.value.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });

                
                    var oDeptModel = new JSONModel({ Departments: data.value });

                  
                    var oSearchField = new SearchField({
                        width: "100%",
                        placeholder: "Search by Department Name...",
                        liveChange: function (oEvent) {
                            var sQuery = oEvent.getParameter("newValue").toLowerCase();
                            var aFiltered = data.value.filter(function (item) {
                                return item.name.toLowerCase().includes(sQuery);
                            });
                            oDeptModel.setData({ Departments: aFiltered });
                        },
                        search: function (oEvent) {
                            var sQuery = oEvent.getParameter("query").toLowerCase();
                            var aFiltered = data.value.filter(function (item) {
                                return item.name.toLowerCase().includes(sQuery);
                            });
                            oDeptModel.setData({ Departments: aFiltered });
                        }
                    });

                    
                    var oTable = new sap.m.Table({
                        columns: [
                            new Column({ header: new Text({ text: "Department Name" }) }),
                            new Column({ header: new Text({ text: "Location" }) })
                        ],
                        items: {
                            path: "/Departments",
                            template: new ColumnListItem({
                                cells: [
                                    new Text({ text: "{name}" }),
                                    new Text({ text: "{location}" })
                                ]
                            })
                        }
                    });

                    oTable.setModel(oDeptModel);

                    
                    var oDialog = new Dialog({
                        title: "Departments (Sorted by Name)",
                        type: DialogType.Message,
                        contentWidth: "600px",
                        contentHeight: "450px",
                        resizable: true,
                        draggable: true,
                        content: [oSearchField, oTable],
                        beginButton: new Button({
                            text: "Close",
                            type: ButtonType.Emphasized,
                            press: function () {
                                oDialog.close();
                            }
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                oDialog.close();
                            }
                        }),
                        afterClose: function () {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();

                },
                error: function (xhr, status, error) {
                    sap.ui.core.BusyIndicator.hide();
                    var errorMsg = xhr.responseJSON?.error?.message || error;
                    MessageBox.error("Failed to fetch departments: " + errorMsg);
                }
            });
        },
         add: function () {

    var oNewDeptModel = new JSONModel({
        name: "",
        location: ""
    });

    var oNameInput = new Input({ placeholder: "Enter Department Name", width: "100%" });
    var oLocationInput = new Input({ placeholder: "Enter Location", width: "100%" });

    oNameInput.setModel(oNewDeptModel);
    oNameInput.bindValue("/name");

    oLocationInput.setModel(oNewDeptModel);
    oLocationInput.bindValue("/location");

    var oDialog = new Dialog({
        title: "Create New Department",
        type: DialogType.Standard,
        resizable: true,
        draggable: true,
        content: [
            new Label({ text: "Department Name" }),
            oNameInput,
            new Label({ text: "Location" }),
            oLocationInput
        ],
        beginButton: new Button({
            text: "Submit",
            type: ButtonType.Emphasized,
            press: function () {
                var deptData = oNewDeptModel.getData();

                if (!deptData.name || !deptData.location) {
                    MessageBox.warning("Please enter both Department Name and Location.");
                    return;
                }

                sap.ui.core.BusyIndicator.show(0);

               
                jQuery.ajax({
                    url: "/odata/v4/school/CreateDepartment",  
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(deptData),
                    success: function (response) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Department created successfully via action!");
                        var oListModel = sap.ui.getCore().getModel(); 
                        if (oListModel) oListModel.refresh();

                        oDialog.close();
                    },
                    error: function (xhr, status, error) {
                        sap.ui.core.BusyIndicator.hide();
                        var errorMsg = xhr.responseJSON?.error?.message || error;
                        MessageBox.error("Failed to create department: " + errorMsg);
                    }
                });
            }
        }),
        endButton: new Button({
            text: "Cancel",
            press: function () {
                oDialog.close();
            }
        }),
        afterClose: function () {
            oDialog.destroy();
        }
    });

    oDialog.open();
}


        
        
        

    };
});
