using {sap.capire.bookshop as my} from '../db/schema';

service SchoolService {
    entity Department as projection on my.Department;
    entity Teachers as projection on my.Teachers;
    entity Students as projection on my.Students;
    entity StudentDetails as projection on my.StudentDetails;
    
    action CreateDepartment (name : String,location : String) returns String ;
    
}
