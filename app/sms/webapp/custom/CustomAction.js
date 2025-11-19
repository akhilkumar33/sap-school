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
                        MessageToast.show("No departments found not found!");
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
                        MessageBox.error("Failed toooo create department: " + errorMsg);
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
},

sortStudents: function (oBindingContext, aSelectedContexts) {
    sap.ui.core.BusyIndicator.show(0);

    // Get the teacher ID from the binding context
    var oContext = oBindingContext || (aSelectedContexts && aSelectedContexts[0]);
    if (!oContext) {
        MessageBox.error("No teacher context found!");
        sap.ui.core.BusyIndicator.hide();
        return;
    }

    var sTeacherID = oContext.getProperty("ID");
    
    jQuery.ajax({
        url: "/odata/v4/school/Teachers(" + sTeacherID + ")/Students",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            sap.ui.core.BusyIndicator.hide();

            if (!data.value || data.value.length === 0) {
                MessageToast.show("No students found for this teacher!");
                return;
            }

            // Sort students by name
            data.value.sort(function (a, b) {
                return a.Name.localeCompare(b.Name);
            });

            // Create JSON model for students
            var oStudentModel = new JSONModel({ Students: data.value });

            // Create search field
            var oSearchField = new SearchField({
                width: "100%",
                placeholder: "Search by Student Name...",
                liveChange: function (oEvent) {
                    var sQuery = oEvent.getParameter("newValue").toLowerCase();
                    var aFiltered = data.value.filter(function (item) {
                        return item.Name.toLowerCase().includes(sQuery);
                    });
                    oStudentModel.setData({ Students: aFiltered });
                },
                search: function (oEvent) {
                    var sQuery = oEvent.getParameter("query").toLowerCase();
                    var aFiltered = data.value.filter(function (item) {
                        return item.Name.toLowerCase().includes(sQuery);
                    });
                    oStudentModel.setData({ Students: aFiltered });
                }
            });

            // Create table
            var oTable = new sap.m.Table({
                columns: [
                    new Column({ header: new Text({ text: "Student Name" }) }),
                    new Column({ header: new Text({ text: "Grade" }) })
                ],
                items: {
                    path: "/Students",
                    template: new ColumnListItem({
                        cells: [
                            new Text({ text: "{Name}" }),
                            new Text({ text: "{grade}" })
                        ]
                    })
                }
            });

            oTable.setModel(oStudentModel);

            // Create dialog
            var oDialog = new Dialog({
                title: "Students (Sorted by Name)",
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
            MessageBox.error("Failed to fetch students: " + errorMsg);
        },

        //DELETE STUDENT
        deleteStudent: function (oBindingContext, aSelectedContexts) {
    // Get the selected student context
    var oContext = aSelectedContexts && aSelectedContexts[0];
    if (!oContext) {
        MessageBox.error("Please select a student to delete!");
        return;
    }

    // Get student data
    var oStudentData = oContext.getObject();
    var sStudentID = oStudentData.ID;
    var sStudentName = oStudentData.Name;

    // Confirmation dialog
    MessageBox.confirm(
        "Are you sure you want to delete student '" + sStudentName + "'?",
        {
            title: "Confirm Deletion",
            onClose: function (oAction) {
                if (oAction === MessageBox.Action.OK) {
                    sap.ui.core.BusyIndicator.show(0);

                    // DELETE request
                    jQuery.ajax({
                        url: "/odata/v4/school/Students(" + sStudentID + ")",
                        type: "DELETE",
                        contentType: "application/json",
                        success: function (response) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Student deleted successfully!");
                            
                            // Refresh the binding to remove deleted student
                            oContext.getBinding().refresh();
                        },
                        error: function (xhr, status, error) {
                            sap.ui.core.BusyIndicator.hide();
                            var errorMsg = xhr.responseJSON?.error?.message || error;
                            MessageBox.error("Failed to delete student: " + errorMsg);
                        }
                    });
                }
            }
        }
    );
}
    });
},

editStudentDetails: function (oBindingContext, aSelectedContexts) {
    // Get the teacher context
    var oContext = oBindingContext;
    if (!oContext) {
        MessageBox.error("No teacher context found!");
        return;
    }

    var sTeacherID = oContext.getProperty("ID");

    sap.ui.core.BusyIndicator.show(0);

    // First, fetch all students for this teacher
    jQuery.ajax({
        url: "/odata/v4/school/Teachers(" + sTeacherID + ")/Students?$expand=studentDetails",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            sap.ui.core.BusyIndicator.hide();

            if (!data.value || data.value.length === 0) {
                MessageBox.information("No students found for this teacher!");
                return;
            }

            // Filter students that have details
            var studentsWithDetails = data.value.filter(function(student) {
                return student.studentDetails && student.studentDetails.ID;
            });

            if (studentsWithDetails.length === 0) {
                MessageBox.information("No student details found. Please add details first.");
                return;
            }

            // Create model for students list
            var oStudentListModel = new JSONModel({ Students: studentsWithDetails });

            // Create search field
            var oSearchField = new SearchField({
                width: "100%",
                placeholder: "Search by Student Name...",
                liveChange: function (oEvent) {
                    var sQuery = oEvent.getParameter("newValue").toLowerCase();
                    var aFiltered = studentsWithDetails.filter(function (item) {
                        return item.Name.toLowerCase().includes(sQuery);
                    });
                    oStudentListModel.setData({ Students: aFiltered });
                }
            });

            // Create table to select student
            var oTable = new sap.m.Table({
                mode: "SingleSelectMaster",
                columns: [
                    new Column({ header: new Text({ text: "Student Name" }) }),
                    new Column({ header: new Text({ text: "Parent Name" }) }),
                    new Column({ header: new Text({ text: "Contact Number" }) })
                ],
                items: {
                    path: "/Students",
                    template: new ColumnListItem({
                        cells: [
                            new Text({ text: "{Name}" }),
                            new Text({ text: "{studentDetails/parentName}" }),
                            new Text({ text: "{studentDetails/contactNumber}" })
                        ]
                    })
                }
            });

            oTable.setModel(oStudentListModel);

            // Create selection dialog
            var oSelectDialog = new Dialog({
                title: "Select Student to Edit Details",
                type: DialogType.Message,
                contentWidth: "700px",
                contentHeight: "450px",
                resizable: true,
                draggable: true,
                content: [oSearchField, oTable],
                beginButton: new Button({
                    text: "Edit Selected",
                    type: ButtonType.Emphasized,
                    press: function () {
                        var oSelectedItem = oTable.getSelectedItem();
                        if (!oSelectedItem) {
                            MessageBox.warning("Please select a student!");
                            return;
                        }

                        var oSelectedContext = oSelectedItem.getBindingContext();
                        var oSelectedStudent = oSelectedContext.getObject();
                        var oDetailsData = oSelectedStudent.studentDetails;

                        oSelectDialog.close();

                        // Open edit dialog
                        openEditDialog(oDetailsData, oContext);
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function () {
                        oSelectDialog.close();
                    }
                }),
                afterClose: function () {
                    oSelectDialog.destroy();
                }
            });

            oSelectDialog.open();

        },
        error: function (xhr, status, error) {
            sap.ui.core.BusyIndicator.hide();
            var errorMsg = xhr.responseJSON?.error?.message || error;
            MessageBox.error("Failed to fetch students: " + errorMsg);
        }
    });

    // Function to open edit dialog
    function openEditDialog(oDetailsData, oContext) {
        var sDetailsID = oDetailsData.ID;

        // Create model with current student details data
        var oEditModel = new JSONModel({
            parentName: oDetailsData.parentName || "",
            contactNumber: oDetailsData.contactNumber || "",
            dateOfBirth: oDetailsData.dateOfBirth || null,
            address: oDetailsData.address || ""
        });

        // Create input fields
        var oParentNameInput = new Input({ 
            value: "{/parentName}",
            placeholder: "Enter Parent Name", 
            width: "100%" 
        });
        
        var oContactInput = new Input({ 
            value: "{/contactNumber}",
            placeholder: "Enter Contact Number", 
            width: "100%" 
        });

        var oDateInput = new sap.m.DatePicker({ 
            value: "{/dateOfBirth}",
            placeholder: "Select Date of Birth",
            valueFormat: "yyyy-MM-dd",
            displayFormat: "dd/MM/yyyy",
            width: "100%" 
        });

        var oAddressInput = new sap.m.TextArea({ 
            value: "{/address}",
            placeholder: "Enter Address",
            rows: 3,
            width: "100%" 
        });

        // Bind model to inputs
        oParentNameInput.setModel(oEditModel);
        oContactInput.setModel(oEditModel);
        oDateInput.setModel(oEditModel);
        oAddressInput.setModel(oEditModel);

        // Create edit dialog
        var oEditDialog = new Dialog({
            title: "Edit Student Details",
            type: DialogType.Standard,
            contentWidth: "500px",
            resizable: true,
            draggable: true,
            content: [
                new VBox({
                    items: [
                        new Label({ text: "Parent Name", required: true }),
                        oParentNameInput,
                        new Label({ text: "Contact Number", required: true }),
                        oContactInput,
                        new Label({ text: "Date of Birth" }),
                        oDateInput,
                        new Label({ text: "Address" }),
                        oAddressInput
                    ]
                })
            ],
            beginButton: new Button({
                text: "Update",
                type: ButtonType.Emphasized,
                press: function () {
                    var updatedData = oEditModel.getData();

                    if (!updatedData.parentName || !updatedData.contactNumber) {
                        MessageBox.warning("Please enter Parent Name and Contact Number.");
                        return;
                    }

                    sap.ui.core.BusyIndicator.show(0);

                    // PATCH request to update student details
                    jQuery.ajax({
                        url: "/odata/v4/school/StudentDetails(" + sDetailsID + ")",
                        type: "PATCH",
                        contentType: "application/json",
                        data: JSON.stringify(updatedData),
                        success: function (response) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Student details updated successfully!");
                            
                            // Refresh the model
                            var oModel = oContext.getModel();
                            if (oModel) {
                                oModel.refresh();
                            }
                            
                            oEditDialog.close();
                        },
                        error: function (xhr, status, error) {
                            sap.ui.core.BusyIndicator.hide();
                            var errorMsg = xhr.responseJSON?.error?.message || error;
                            MessageBox.error("Failed to update student details: " + errorMsg);
                        }
                    });
                }
            }),
            endButton: new Button({
                text: "Cancel",
                press: function () {
                    oEditDialog.close();
                }
            }),
            afterClose: function () {
                oEditDialog.destroy();
            }
        });

        oEditDialog.open();
    }
}


        
        
        

    };
});
