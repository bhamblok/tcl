<?xml version="1.0" encoding="UTF-8"?>

<!--
    MusicXML™ parttime.xsl stylesheet

    Version 3.0
    
    Copyright © 2004-2011 MakeMusic, Inc.
    http://www.makemusic.com/
    
    This MusicXML™ work is being provided by the copyright
    holder under the MusicXML Public License Version 3.0,
    available from:
    
        http://www.musicxml.org/dtds/license.html
-->

<!--
    Parttime.xsl is an XSLT stylesheet for transforming
    partwise MusicXML scores into timewise scores. Thus
    instead of having measures included within each part,
    the transformed score includes parts within each measure.
    This type of transformation allows the 2-dimensional
    nature of a musical score to be adequately represented
    within a hierarchical format like XML.
-->

<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" encoding="UTF-8" indent="yes" />
  <!--
    For the root, only look for dsplanning. Anything else as a root element gets
    ignored.
  -->  
  <xsl:template match="/">
    <xsl:apply-templates select="./dsplanning"/>
  </xsl:template>

  <!-- The identity transformation. Used by default. -->
  <xsl:template match="text()">
    <xsl:value-of select="." />
  </xsl:template>
    
  <!--
    Whitespace within an xsl:copy could cause problems with
    empty elements.
  -->
  <xsl:template match="*|@*|comment()|processing-instruction()">
    <xsl:copy><xsl:apply-templates
        select="*|@*|comment()|processing-instruction()|text()"
    /></xsl:copy>
  </xsl:template>

  <!-- <xsl:template match="dsplanning">
    <tcl-row>
        <xsl:apply-templates select="@* | node()" />
    </tcl-row>
  </xsl:template>

  <xsl:template match="ttplanning">
    <tcl-card>
      <xsl:apply-templates select="@* | node()"/>
    </tcl-card>
  </xsl:template> -->

  <!--
    Avoid self closing elements
  -->
  <!-- Define a dummy variable with empty content -->
  <xsl:variable name="empty" select="''"/>

  <!-- Copy input to output, most of the time -->
  <xsl:template match="@* | node()">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" />
      <!-- Insert empty content into copied element -->
      <xsl:value-of select="$empty"/>
    </xsl:copy>
  </xsl:template>
  <!-- <xsl:template match=
    "*[not(*|comment()|processing-instruction()) 
     and normalize-space()=''
      ]">
      <xsl:copy>
        <xsl:apply-templates select="@*"/> -->
        <!-- note space here -->
        <!-- <xsl:text>NULL</xsl:text>
        <xsl:value-of select="text()" />
      </xsl:copy>
  </xsl:template> -->
</xsl:stylesheet>
