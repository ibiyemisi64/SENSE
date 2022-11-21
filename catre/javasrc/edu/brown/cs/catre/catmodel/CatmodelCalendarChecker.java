/********************************************************************************/
/*                                                                              */
/*              CatmodelCalendarChecker.java                                    */
/*                                                                              */
/*      Code to periodically check user calendars                               */
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



package edu.brown.cs.catre.catmodel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimerTask;
import java.util.WeakHashMap;

import edu.brown.cs.catre.catre.CatreLog;
import edu.brown.cs.catre.catre.CatreUniverse;
import edu.brown.cs.catre.catre.CatreWorld;

class CatmodelCalendarChecker implements CatmodelConstants
{

/********************************************************************************/
/*										*/
/*	Private Storage 							*/
/*										*/
/********************************************************************************/

private WeakHashMap<CatmodelCondition,Boolean>	check_conditions;
private Set<CatreWorld>				active_worlds;


/********************************************************************************/
/*										*/
/*	Constructors								*/
/*										*/
/********************************************************************************/

CatmodelCalendarChecker()
{
   check_conditions = new WeakHashMap<CatmodelCondition,Boolean>();
   active_worlds = new HashSet<CatreWorld>();
}



/********************************************************************************/
/*										*/
/*	Access methods								*/
/*										*/
/********************************************************************************/

synchronized void addCondition(CatmodelCondition bc)
{
   CatreLog.logT("CATMODEL","Add Calendar condition " + bc);
   
   check_conditions.put(bc,false);
   setTime();
}


/********************************************************************************/
/*										*/
/*	Set up for next check							*/
/*										*/
/********************************************************************************/

private void setTime()
{
   Set<CatreWorld> worlds = new HashSet<CatreWorld>();
   List<CatmodelCondition> tocheck = new ArrayList<CatmodelCondition>();
   synchronized(this) {
      tocheck.addAll(check_conditions.keySet());
    }
   for (CatmodelCondition bc : tocheck) {
      CatreUniverse uu = bc.getUniverse();
      worlds.add(uu.getCurrentWorld());
    }
   
   for (CatreWorld uw : worlds) {
      setTime(uw);
    }
   
}


private void setTime(CatreWorld uw)
{
   CatreLog.logT("CATMODEL","Check Calendar world " + uw);
   
   synchronized (this) {
      if (active_worlds.contains(uw)) return;
      active_worlds.add(uw);
    }
   
   long delay = T_HOUR; 		// check at least each hour to allow new events
   long now = System.currentTimeMillis();	
   
   CatmodelGoogleCalendar gc = CatmodelGoogleCalendar.getCalendar(uw);
   if (gc == null) {
      CatreLog.logI("CATMODEL","No Calendar found for world " + uw);
      removeActive(uw);
      return;
    }
   
   Collection<CalendarEvent> evts = gc.getActiveEvents(now);
   for (CalendarEvent ce : evts) {
      long tim = ce.getStartTime();
      if (tim <= now) tim = ce.getEndTime();
      CatreLog.logI("CATMODEL","Calendar Event " + tim + " " + now + " " + ce);
      if (tim <= now) continue;
      delay = Math.min(delay,tim-now);
    }
   delay = Math.max(delay,10000);
   CatreLog.logI("CATMODEL","Schedule Calendar check for " + uw + " " + delay + " at " + (new Date(now+delay).toString()));
   
   CatmodelUniverse cmu = (CatmodelUniverse) uw.getUniverse();
   cmu.getCatre().schedule(new CheckTimer(uw),delay);
}



private synchronized void removeActive(CatreWorld uw)
{
   CatreLog.logI("CATMODEL","Remove Calendar world " + uw);
   active_worlds.remove(uw);
}




/********************************************************************************/
/*										*/
/*	Recheck pending events							*/
/*										*/
/********************************************************************************/

private void recheck(CatreWorld uw)
{
   List<CatmodelCondition> tocheck = new ArrayList<CatmodelCondition>();
   synchronized(this) {
      tocheck.addAll(check_conditions.keySet());
    }
   
   for (CatmodelCondition bc : tocheck) {
      CatreUniverse uu = bc.getUniverse();
      CatreWorld cw = uu.getCurrentWorld();
      if (uw == cw) bc.setTime(cw);
    }
}



/********************************************************************************/
/*										*/
/*	TimerTask for checking							*/
/*										*/
/********************************************************************************/

private class CheckTimer extends TimerTask {
   
   private CatreWorld for_world;
   
   CheckTimer(CatreWorld uw) {
      for_world = uw;
    }
   
   @Override public void run() {
      CatreLog.logI("CATMODEL","Checking google Calendar for " + for_world + " at " + (new Date().toString()));
      removeActive(for_world);
      recheck(for_world);
      setTime();
    }
   
}	// end of inner class CheckTimer



}       // end of class CatmodelCalendarChecker




/* end of CatmodelCalendarChecker.java */
