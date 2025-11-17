using SchoolService as service from '../../srv/school-service';

/* Department Annotation */
annotate service.Department with @(
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
            ID     : 'DeptGeneralInfo',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#GeneralInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'TeachersFacet',
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
            Target : 'Students/@UI.LineItem#StudentList'
        }
    ]
);
annotate service.Students with @(
    UI.FieldGroup #StudentInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Label : 'Student Name', Value : Name },
            { $Type : 'UI.DataField', Label : 'Grade', Value : grade }
        ]
    },
    UI.LineItem #StudentList : [
        { $Type : 'UI.DataField', Label : 'Student Name', Value : Name },
        { $Type : 'UI.DataField', Label : 'Grade', Value : grade }
    ],
    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Student Information',
            Target : '@UI.FieldGroup#StudentInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Student Details',
            Target : 'StudentDetails/@UI.LineItem#DetailsList'
        }
    ]
);

annotate service.StudentDetails with @(
    UI.FieldGroup #DetailsInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Label : 'DOB', Value : dateOfBirth },
            { $Type : 'UI.DataField', Label : 'Contact Number', Value : contactNumber },
            { $Type : 'UI.DataField', Label : 'Parent Name', Value : parentName },
            { $Type : 'UI.DataField', Label : 'Address', Value : Address },
            { $Type : 'UI.DataField', Label : 'Teacher', Value : teacher }
        ]
    },
    UI.LineItem #DetailsList : [
        { $Type : 'UI.DataField', Label : 'DOB', Value : dateOfBirth },
        { $Type : 'UI.DataField', Label : 'Contact Number', Value : contactNumber },
        { $Type : 'UI.DataField', Label : 'Parent Name', Value : parentName },
        { $Type : 'UI.DataField', Label : 'Address', Value : Address },
        { $Type : 'UI.DataField', Label : 'Teacher', Value : teacher }
    ],
    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Student Details Information',
            Target : '@UI.FieldGroup#DetailsInfo'
        }
    ]
);
