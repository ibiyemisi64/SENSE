# SENSE - Smart Environment Network for Sensor-Based Events

Project Goal Statement: 
Our project aims to develop a sophisticated, rule-based smart sign system 
integrated with various IoT devices and platforms, with a focus on user 
personalization and automated status updates. The current project focus 
includes the improving user interface, implementing ALDS, and expanding 
multi-user support.

This repository contains a set of projects designed to make controlling IoT
devices easier.

As more and more devices become available and interconnected,
there is a growing need for end users to control the
devices in a programmatic manner. Our prior work explored end
user programming models for the Internet of Things (IoT). We
started with the premise that current trigger-based approaches,
while helpful, are not sufficient. What is needed was a more
programmatic, continuous approach for handling more complex
devices and complex conditions. Our prior work explored different
strategies for such a continuous approach. This project builds on
this prior work and attempts to build a practical and scalable
system for handling complex devices and complex conditions.

The project includes several subprojects.  The main component is
a rule-based engine for controlling devices, CATRE.  This interfaces
with specific IoT devices and various hubs using the CEDES bridge
package.  ALDS is a new phone app for reporting one's location and
status as input to CATRE.  SHERPA is the user interface that lets
users program IoT devices using easy-to-understand rules.  Finally,
we include an intelligent sign device, iQsign, that can display and automatically
update one's current status using CATRE.


The individual projects include:

## iQsign

This is a cloud-based implementation of a smart sign.  It enables web or remote
control of a sign based on a simple description language.  It provides both a
web site that updates automatically and an image that it updates as requested for
each sign.  Users can register and control their signs.  iQsign is currently
available at `https://sherpa.cs.brown.edu:3336`


### Developer Guide

To start the program, run the following command in the iqsignv2 directory:
```
npm run dev
```

src directory breakdown:
* Auth: User authentication pages. Currently replaced with a workedaround with access code due to issues with existing authentication methods.
* Gallery: Displays signs in a gallery style.
* Sign: Page to edit sign.
* Topbar: Topbar for all the pages in iQsign.
* App.jsx: Entry point for the program, contains routes to all pages.
* Homepage.jsx: Homepage of the application, where user can view the current sign and navigate to edit sign, gallery, and profile.
* Profile.jsx: Displays user information, generation of access code, and routes edit user info and logout.

## Signmaker

This is the utility that creates the sign images for iQsign from descriptions.

## Catre: Continuous And Trigger-based Rule Environment

Back end rule engine for controlling IoT devices based on intervals rather than
(or in addition to) triggers.

## Cedes: Catre External Device Environment Server

Bridges from various IoT devices/systems to Catre

## ALDS:  Automatic Location Detector Service

Phone app to report location and other information to Catre

## SHERPA: Smart hub environment for running prioritized analysis

Front end for defining and editing rules for Catre.








