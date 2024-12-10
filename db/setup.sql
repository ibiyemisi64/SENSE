#! /bin/csh -fx

set db = iqsign
set host = "-h db.cs.brown.edu"
set run = psql

alias ENUM "source ./ENUM.csh"

setenv sqlrun $run

if (-e ../secret/dbdev) then
   set db = iqsignv2
   set host = "-h db.cs.brown.edu -U cs2340sense"
endif


set idtype = 'int'
set iddeftype = 'int'
set sidtype = 'character(32)'
set cattype = 'varchar(32)'
set phonetype = 'varchar(32)'
set urltype = 'text'
set desctype = 'text'
set amentype = 'text'
set imagefile = 'text'
set money = 'numeric(10,2)'
set address = 'varchar(1023)'
set datetime = 'timestamp'
set date = 'date'
set email = 'varchar(255)'

if ( $run == mysql ) then
   set runcmd =
   set rlike = rlike
   set useviews = 0
   set group =
   set dogrant = 1
   set grantto = "'spheree'@'%'"
   set ENDTABLE = ') ENGINE = InnoDB'
   set DEFAULTDB =
   set ENCODE = "DEFAULT CHARACTER SET = 'utf8' DEFAULT COLLATE = utf8_unicode_ci"
   set PREFIX = "SET FOREIGN_KEY_CHECKS = 1;"
   set iddeftype = 'int AUTO_INCREMENT'
else if ( $run == psql) then
   set runcmd = '\set ON_ERROR_STOP';
   set rlike = '~'
   set useviews = 1
   set dogrant =
   set group =
   set ENDTABLE = ')'
   set DEFAULTDB = postgres
   set ENCODE = "TEMPLATE template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8'"
   set PREFIX =
   set iddeftype = 'serial'
endif

























