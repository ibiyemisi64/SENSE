/********************************************************************************/
/*                                                                              */
/*              CattestSetup.java                                               */
/*                                                                              */
/*      Setup CATRE for our own home                                            */
/*                                                                              */
/********************************************************************************/
/*      Copyright 2011 Brown University -- Steven P. Reiss                    */
/*********************************************************************************
 *  Copyright 2011, Brown University, Providence, RI.                            *
 *                                                                               *
 *                        All Rights Reserved                                    *
 *                                                                               *
 * This program and the accompanying materials are made available under the      *
 * terms of the Eclipse Public License v1.0 which accompanies this distribution, *
 * and is available at                                                           *
 *      http://www.eclipse.org/legal/epl-v10.html                                *
 *                                                                               *
 ********************************************************************************/

/* SVN: $Id$ */



package edu.brown.cs.catre.cattest;

import java.io.File;
import java.io.IOException;

import org.json.JSONObject;

import edu.brown.cs.catre.catre.CatreUtil;
import edu.brown.cs.ivy.file.IvyFile;

public class CattestSetup implements CattestConstants
{



/********************************************************************************/
/*                                                                              */
/*      Main program                                                            */
/*                                                                              */
/********************************************************************************/

public static void main(String [] args)
{
   CattestSetup setup = new CattestSetup(args);
   
   setup.runSetup();
}


/********************************************************************************/
/*                                                                              */
/*      Private Storage                                                         */
/*                                                                              */
/********************************************************************************/



/********************************************************************************/
/*                                                                              */
/*      Constructors                                                            */
/*                                                                              */
/********************************************************************************/

private CattestSetup(String [] args)
{
   CattestUtil.startCatre();
}




/********************************************************************************/
/*                                                                              */
/*      Running methods                                                         */
/*                                                                              */
/********************************************************************************/

private void runSetup()
{
   File logindata = new File("/pro/iot/secret/catrelogin");
   JSONObject data = null;
   try {
      data = new JSONObject(IvyFile.loadFile(logindata));
    }
   catch (IOException e) { 
      System.exit(1);
    }
   String user = data.getString("user");
   String pwd = data.getString("password");
   String email = data.getString("email");
   String stuser = data.getString("stuser");
   String stacc = data.getString("staccess");
   
   String v1 = CatreUtil.sha256(pwd);
   String v2 = v1 + user;
   String v3 = CatreUtil.sha256(v2);  
      
   JSONObject rslt2 = CattestUtil.sendGet("/login");      
   String sid = rslt2.getString("CATRESESSION");
   String salt = rslt2.getString("SALT");
   
   String v4 = v3 + salt;
   String v5 = CatreUtil.sha256(v4);
   JSONObject rslt3 = CattestUtil.sendJson("POST","/login",
         "CATRESESSION",sid,"SALT",salt,
         "username",user,"password",v5);
   if (!rslt3.getString("STATUS").equals("OK")) {
      // if login fails, try to register
      sid = rslt3.getString("CATRESESSION");
      JSONObject rslt1 = CattestUtil.sendJson("POST","/register",
            "username",user,
            "email",email,
            "password",v3,
            "universe","MyWorld");
       sid = rslt1.getString("CATRESESSION");
    }
   
   JSONObject rslt4 = CattestUtil.sendJson("POST","/bridge/add",
         "CATRESESSION",sid,"BRIDGE","SmartThings","user",stuser,
         "access",stacc);
   sid = rslt4.getString("CATRESESSION");
}



}       // end of class CattestSetup




/* end of CattestSetup.java */
