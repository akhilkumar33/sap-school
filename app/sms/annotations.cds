using SchoolService as service from '../../srv/school-service';

annotate service.Department with @(

    UI.HeaderInfo : {
        TypeName        : 'Department',
        TypeNamePlural  : 'Departments',
        Title           : { Value : name },
        Description     : { Value : location }
    },

    UI.FieldGroup #GeneralInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Label : 'Department Name', Value : name },
            { $Type : 'UI.DataField', Label : 'Location', Value : location }
        ]
    },

    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#GeneralInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Teachers',
            Target : 'Teachers/@UI.LineItem#TeacherList'
        }
    ],

    UI.LineItem : [
        { $Type : 'UI.DataField', Label : 'Department Name', Value : name },
        { $Type : 'UI.DataField', Label : 'Location', Value : location }
    ]
);

annotate service.Teachers with @(

    UI.HeaderInfo : {
        TypeName       : 'Teacher',
        TypeNamePlural : 'Teachers',
        Title          : { Value : Name },
        Description    : { Value : subject }
    },

    UI.FieldGroup #TeacherInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Label : 'Teacher Name', Value : Name },
            { $Type : 'UI.DataField', Label : 'Subject', Value : subject }
        ]
    },

    UI.LineItem #TeacherList : [
        { $Type : 'UI.DataField', Label : 'Teacher Name', Value : Name },
        { $Type : 'UI.DataField', Label : 'Subject', Value : subject }
    ],

    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Teacher Information',
            Target : '@UI.FieldGroup#TeacherInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Students',
            Target : 'Students/@UI.LineItem'
        }
    ]
);

annotate service.Students with @(

    UI.HeaderInfo : {
        TypeName        : 'Student',
        TypeNamePlural  : 'Students',
        Title           : { Value : Name },
        Description     : { Value : grade }
    },

    UI.FieldGroup #StudentInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Label : 'Student Name', Value : Name },
            { $Type : 'UI.DataField', Label : 'Grade', Value : grade }
        ]
    },

    UI.LineItem  : [
        { $Type : 'UI.DataField', Label : 'Student Name', Value : Name },
        { $Type : 'UI.DataField', Label : 'Grade', Value : grade }
    ],

    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#StudentInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Student Details',
            Target : 'studentDetails/@UI.FieldGroup#General'
        }
    ]
);

annotate service.StudentDetails with @(
    UI.HeaderInfo : {
        TypeName       : 'Detail',
        TypeNamePlural : 'Details',
        Title          : { Value : parentName }
    },

    UI.SelectionFields : [
        parentName,
        contactNumber
    ],

    UI.LineItem : [
        { $Type : 'UI.DataField', Value : parentName, Label : 'Parent Name' },
        { $Type : 'UI.DataField', Value : contactNumber, Label : 'Contact Number' },
        { $Type : 'UI.DataField', Value : dateOfBirth, Label : 'Date of Birth' }
    ],

    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Detail Info',
            Target : '@UI.FieldGroup#General'
        }
    ],

    UI.FieldGroup#General : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Label : 'Parent Name',     Value :parentName },
            { $Type : 'UI.DataField', Label : 'Contact Number',  Value : contactNumber },
            { $Type : 'UI.DataField', Label : 'Date of Birth',   Value : dateOfBirth },
            { $Type : 'UI.DataField', Label : 'Address',         Value : address },
            { $Type : 'UI.DataField', Label : 'Student Name',    Value : student.Name },
            { $Type : 'UI.DataField', Label : 'Teacher Name',    Value : student.teacher.Name }

        ]
    }
);