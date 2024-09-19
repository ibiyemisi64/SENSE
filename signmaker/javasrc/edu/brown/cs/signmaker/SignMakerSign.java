/********************************************************************************/
/*                                                                              */
/*              SignMakerSign.java                                              */
/*                                                                              */
/*      Hold all the information for the current sign                           */
/*                                                                              */
/********************************************************************************/

package edu.brown.cs.signmaker;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.GraphicsEnvironment;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.swing.JComponent;
import javax.swing.JPanel;

import edu.brown.cs.ivy.file.IvyFile;

class SignMakerSign implements SignMakerConstants
{


/********************************************************************************/
/*                                                                              */
/*      Private Storage                                                         */
/*                                                                              */
/********************************************************************************/

private SignMakerText []        text_regions;
private SignMakerImage []       image_regions;

private Color                   background_color;
private Color                   foreground_color;
private String                  font_family;
private Map<SignMakerComponent,Rectangle2D> item_positions;
private Map<String,String>      key_values;
private int                     user_id;
private boolean                 do_counts;


private static double [] SCALE_VALUES = {
   1.0, 1.2, 1.4, 1.6, 1.8, 2.0
};

private static Set<String> font_names;

static {
   font_names = new HashSet<>();
   GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
   String [] nms = ge.getAvailableFontFamilyNames();
   for (String s : nms) {
      font_names.add(s.toLowerCase());
      int idx = s.indexOf(" ");
      if (idx > 0) {
         String s1 = s.substring(0,idx);
         font_names.add(s1);
       }
    }
}



/********************************************************************************/
/*                                                                              */
/*      Constructors                                                            */
/*                                                                              */
/********************************************************************************/

SignMakerSign(int uid,boolean counts) 
{
   text_regions = new SignMakerText[8];
   image_regions = new SignMakerImage[8];
   background_color = Color.WHITE;
   foreground_color = Color.BLACK;
   font_family = null;
   item_positions = new HashMap<>();
   key_values = new HashMap<>();
   user_id = uid;
   do_counts = counts;
}



/********************************************************************************/
/*                                                                              */
/*      Output methods                                                          */
/*                                                                              */
/********************************************************************************/

BufferedImage createSignImage(int w,int h)
{
// System.err.println("SIGNMAKER: create sign image " + w + " " + h + " " +
//       Arrays.toString(text_regions) + " " + 
//       Arrays.toString(image_regions) + " " + background_color + " " +
//       font_family + " " + border_width + " " + border_color);
   
   for (int i = 0; i < text_regions.length; ++i) {
      if (text_regions[i] != null && text_regions[i].isEmpty()) text_regions[i] = null;
    }
   for (int i = 0; i < image_regions.length; ++i) {
      if (image_regions[i] != null && image_regions[i].isEmpty()) image_regions[i] = null;
    }
   
   setDimensions(w,h);
   
   JPanel pnl = new JPanel();
   pnl.setSize(w,h);
   pnl.setBackground(background_color);
   pnl.setForeground(foreground_color);
   if (font_family != null) {
      Font ft = new Font(font_family,0,10);
      pnl.setFont(ft);
    }
   
   BufferedImage img = new BufferedImage(w,h,BufferedImage.TYPE_INT_RGB);
   Graphics g = img.getGraphics();
   
  
   for (int i = 0; i < text_regions.length; ++i) {
      setup(pnl,text_regions[i]);
    }
   for (int i = 0; i < image_regions.length; ++i) {
      setup(pnl,image_regions[i]);
    }
   
   for (int i = 0; i < text_regions.length; ++i) {
      waitForReady(text_regions[i]);
    }
   for (int i = 0; i < image_regions.length; ++i) {
      waitForReady(image_regions[i]);
    }
 
   pnl.paint(g);
   
   return img;
}



private void setup(JPanel pnl,SignMakerComponent c)
{
   if (c == null) return;
   
   Rectangle2D r2 = item_positions.get(c);
   if (r2 == null) return;
   
   JComponent comp = c.setupComponent(r2,pnl,this);
   if (comp == null) return;
   
   pnl.add(comp);
   
   comp.setBounds(r2.getBounds());
}


private void waitForReady(SignMakerComponent c) 
{
   if (c == null) return;
   c.waitForReady();
}



/********************************************************************************/
/*                                                                              */
/*      Setup methods                                                           */
/*                                                                              */
/********************************************************************************/

void setBackground(Color c)
{
   background_color = c;
}

void setForeground(Color c)
{
   foreground_color = c;
}

Color getForeground()
{
   return foreground_color;
}

void setBorder(int w,String c)
{ }

boolean setFontFamily(String name)
{
   name = getFontFamily(name);
   if (name == null) return false;
   
   font_family = name;
   return true;
}



static String getFontFamily(String name)
{
   name = name.toLowerCase().trim();
   
   if (!font_names.contains(name)) {
      int idx = name.indexOf("_");
      if (idx < 0) return null;
      String base = name.substring(0,idx);
      if (!font_names.contains(base)) return null;
      name = name.replace("_"," ");
    }
   
   return name;
}


void setTextRegion(int which,SignMakerText rgn)
{
   if (which <= 0 || which >= text_regions.length) return;
   if (rgn != null && !rgn.isEmpty()) text_regions[which] = rgn;
}


void setImageRegion(int which,SignMakerImage rgn)
{
   if (which < 0 || which >= image_regions.length) return;
   if (rgn != null && !rgn.isEmpty()) image_regions[which] = rgn;
}

boolean isTextRegionUsed(int which) 
{
   if (which <= 0 || which >= text_regions.length) return true;
   if (text_regions[which] != null) return true;
   if (which == 4 && image_regions[5] != null) return true;
   if (which == 5 && image_regions[6] != null) return true;
   return false;
}

boolean isImageRegionUsed(int which) 
{
   if (which <= 0 || which >= image_regions.length) return true;
   if (image_regions[which] != null) return true;
   if (which == 5 && text_regions[4] != null) return true;
   if (which == 6 && text_regions[5] != null) return true;
   return false;
}

void setProperty(String key,String value)
{
   key_values.put(key,value);
}




String mapString(String s)
{
   if (key_values.isEmpty()) return s;
   s = IvyFile.expandText(s,key_values,false);
   return s;
}


String useSavedImage(String name)
{
   Connection sql = SignMaker.getSqlDatabase();
   if (sql == null || name == null || name.length() == 0) return null;
   String cnts = null;
   int defid = -1;
   try {
      String q = "SELECT * FROM iQsignDefines WHERE name = ? AND userid = ?";
      PreparedStatement st = sql.prepareStatement(q);
      st.setString(1,name);
      st.setInt(2,user_id);
      ResultSet rs = st.executeQuery();;
      if (rs.next()) {
         cnts = rs.getString("contents");
         defid = rs.getInt("id");
       }
      st.close();
       
      if (cnts == null) {
         String q1 = "SELECT * FROM iQsignDefines WHERE name = ? AND userid IS NULL";
         PreparedStatement st1 = sql.prepareStatement(q1);
         st1.setString(1,name);
         ResultSet rs1 = st1.executeQuery();;
         if (rs1.next()) {
            cnts = rs1.getString("contents");
            defid = rs1.getInt("id");
          }
         st1.close();
       }
      if (cnts == null) {
         System.err.println("PROBLEM LOADING DEFINITION: " + name);
         cnts = "# Bad Sign Image";
       }
      
      if (defid > 0) {
         if (do_counts) {
            String q3 = "SELECT * FROM iQsignUseCounts WHERE defineid = ? AND userid = ?";
            PreparedStatement st3 = sql.prepareStatement(q3);
            st3.setInt(1,defid);
            st3.setInt(2,user_id);
            ResultSet rs3 = st3.executeQuery();
            if (rs3.next()) {
               int count = rs3.getInt("count");
               String q4 = "UPDATE iQsignUseCounts SET count = ?, " +
                     "last_used = CURRENT_TIMESTAMP " +
                     "WHERE defineid = ? AND userid = ?";
               PreparedStatement st4 = sql.prepareStatement(q4);
               st4.setInt(1,count+1);
               st4.setInt(2,defid);
               st4.setInt(3,user_id);
               st4.execute();
             }
            else {
               String q5 = "INSERT INTO iQsignUseCounts(defineid,userid,count) " +
                  "VALUES (?,?,1)";
               PreparedStatement st5 = sql.prepareStatement(q5);
               st5.setInt(1,defid);
               st5.setInt(2,user_id);
               st5.execute();
             }
          }
       }
    }
   catch (SQLException e) {
      System.err.println("signmaker: Database problem: " + e);
      e.printStackTrace();
    }
   
   return cnts;
}



void clearContents()
{
   for (int i = 0; i < text_regions.length; ++i) {
      text_regions[i] = null;
    }
   for (int i = 0; i < image_regions.length; ++i) {
      image_regions[i] = null;
    }
}


/********************************************************************************/
/*                                                                              */
/*      Layout methods                                                          */
/*                                                                              */
/********************************************************************************/

private void setDimensions(double w,double h)
{
   // compute sizing for each of the regions
   SignMakerComponent c0 = text_regions[5];
   if (c0 == null) c0 = image_regions[6];
   SignMakerComponent c1 = text_regions[4];
   if (c1 == null) c1 = image_regions[5];
   
   double [] rows = new double[5];
   rows[0] = getRelativeHeight(image_regions[3],c0,image_regions[4]);
   rows[1] = getRelativeHeight(text_regions[1]);
   rows[2] = getRelativeHeight(text_regions[2]);
   rows[3] = getRelativeHeight(text_regions[3]);
   rows[4] = getRelativeHeight(image_regions[1],c1,image_regions[2]);
   
   double tot = 0;
   for (int i = 0; i < rows.length; ++i) tot += rows[i];
   if (tot == 0) return;
   for (int i = 0; i < rows.length; ++i) {
      rows[i] = rows[i] / tot * h;
    }
   
   double ypos = 0;
   ypos = setPositions(w,ypos,rows[0], image_regions[3],c0,image_regions[4]);
   ypos = setPositions(w,ypos,rows[1],text_regions[1]);
   ypos = setPositions(w,ypos,rows[2],text_regions[2]);
   ypos = setPositions(w,ypos,rows[3],text_regions[3]);
   ypos = setPositions(w,ypos,rows[4],image_regions[1],c1,image_regions[2]);
}



private double getRelativeHeight(SignMakerComponent ... cset)
{
   double level = 0;
   double v;
   for (SignMakerComponent c : cset) {
      if (c == null) continue;
      int lvl = c.getSizeLevel();
      if (Math.abs(lvl) > 5) v = 1;
      else if (lvl >= 0) v = SCALE_VALUES[lvl];
      else v = 1.0 / SCALE_VALUES[-lvl];
      level = Math.max(v,level);
    }
   return level;
}



double setPositions(double w,double y,double h,SignMakerComponent c0,SignMakerComponent c1,SignMakerComponent c2)
{
   if (c0 == null && c2 == null) {
      return setPositions(w,y,h,c1);
    }
   
   double w0 = h;
   if (c0 != null) {
      Rectangle2D r = new Rectangle2D.Double(0,y,w0,h);
      item_positions.put(c0,r);
    }
   if (c2 != null) {
      Rectangle2D r = new Rectangle2D.Double(w-w0,y,w0,h);
      item_positions.put(c2,r); 
    }
   if (c1 != null && c1.isImage()) {
      double w1 = w-2*w0;
      if (w1 > h) {
         w0 += (w1-h)/2;
         w1 = h;
       }
      else if (h > w1) {
         h = w1;
       }
      Rectangle2D r = new Rectangle2D.Double(w0,y,w1,h);
      item_positions.put(c1,r);
    }
   else if (c1 != null) {
      Rectangle2D r = new Rectangle2D.Double(w0,y,w-2*w0,h);
      item_positions.put(c1,r);
    }
   
   return y+h;
}


double setPositions(double w,double y,double h,SignMakerComponent c0)
{
   if (c0 != null) {
      Rectangle2D r = new Rectangle2D.Double(0,y,w,h);
      item_positions.put(c0,r);
    }
   
   return y+h;
}

}       // end of class SignMakerSign




/* end of SignMakerSign.java */

