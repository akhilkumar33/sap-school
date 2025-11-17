using { Currency, managed, sap,cuid } from '@sap/cds/common';

namespace sap.capire.bookshop;

entity Books : managed {
  key ID   : Integer;
  title    : localized String(111)  @mandatory;
  descr    : localized String(1111);
  author   : Association to Authors @mandatory;
  genre    : Association to Genres;
  stock    : Integer;
  price    : Decimal;
  currency : Currency;
}

entity Authors : managed {
  key ID       : Integer;
  name         : String(111) @mandatory;
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books        : Association to many Books
                   on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID       : Integer;
      parent   : Association to Genres;
      children : Composition of many Genres
                   on children.parent = $self;
}

entity Department : cuid {
  name        : String;
  location    : String;
  Teachers    : Association to many Teachers on Teachers.department = $self;
}

entity Teachers : cuid {
  Name        : String;
  subject     : String;
  department  : Association to Department;
  Students    : Association to many Students on Students.teacher = $self;
}

entity Students : cuid {
  Name           : String;
  grade          : Integer;
  teacher        : Association to Teachers;
  studentDetails : Association to many StudentDetails on studentDetails.student = $self;
}

entity StudentDetails : cuid {
  student       : Association to Students;
  teacher : Association to  Teachers;
  dateOfBirth   : Date;
  contactNumber : String;
  parentName    : String;
  Address       : String;
}
