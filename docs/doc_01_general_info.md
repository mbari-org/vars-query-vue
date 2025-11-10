# General Information and Definitions

 The **VARS Query** allows easy searching of the observations stored in MBARI’s video annotation database. Complex queries can be made by constraining concept, temporal, spatial, or physical parameters (e.g. species, season, location, or depth). The VARS query references the knowledgebase (see definition below). Query results are delivered as a table and include the concept and associations, image links, physical and ancillary data, dive information, and tape information. Query results can be saved as tabular text data or images (where they exist).

## *Definitions*
 
 ### General ###
**VARS** (Video Annotation and Reference System) is a software interface and database system that provides tools for describing, cataloging, retrieving, and viewing the visual, descriptive, and quantitative data associated with MBARI’s deep-sea video archives.

The **VARS Knowledgebase** is an extensible database of biological, geological, and technical terms used to describe deep-sea research conducted by the institute.  This database is composed of identifiable objects called *concepts* (e.g. organisms, equipment, sediment types, etc.). The knowledgebase also contains *associations* which serve as descriptors that can be connected with the objects being annotated (e.g. colors, size, behaviors). 

An **annotation** is an observation made at a specific date and time of MBARI's imagery archive.  Each annotation captures details such as the identity of the observed organism or object (*concept*), its behavior, habitat, or other relevant features [^association] *association*.]

### Query Specific ###

An [^association]:*association*  descriptors to be added to a concept to provide more detail about that annotation (behavior, color, posture, sample information, etc.) Each descriptor must be connected to a concept observation. Multiple associations may be used to describe one observation. A concept can have multiple associations to describe the observation.

An *activity* includes the direction or movement of the camera or the intended activity associated with a particular annotation.

A *camera platform* specifies the platform a camera was deployed on while recording the selected observations.

A *concept* is the name of the physical object in an observation.

A *deployment* refers to a specific ROV dive, AUV or instrument deployments where data and imagery were collected. 

An *observation date* is the date the observation was annotated.  Sometimes this is the same as the recorded date from observations made at sea.

An *observer* is the name od ther person who did the annotation

The *recorded date* is the date the imagery was collected.



