/********************************************************************************/
/*                                                                              */
/*              CatreActionException.java                                       */
/*                                                                              */
/*      Exception for action evaluation                                         */
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



package edu.brown.cs.catre.catre;



public class CatreActionException extends CatreException
{


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


public CatreActionException(String msg)
{
   super(msg);
}


public CatreActionException(String msg,Throwable cause)
{
   super(msg,cause);
}


}       // end of class CatreActionException




/* end of CatreActionException.java */
