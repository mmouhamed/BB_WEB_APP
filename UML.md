+----------------+         +-------------------+        +-------------------+
|   BB_PROJECTS  |         |   BB_USER_PROJECTS |        |     BB_USERS      |
+----------------+         +-------------------+        +-------------------+
| PROJECT_ID     |         | USER_ID           |<>------| USER_ID           |
| PROJECT        |<>------>| USER_NAME         |        | DISPLAY_NAME      |
| IS_SORT_FIRST  |         | PROJECT           |<>------| IS_ADMIN          |
| ABBREVIATION   |         | IS_PROJECT_OWNER  |        | USER_NAME         |
| CREATE_WO_EMAIL|         | CAN_CLOSE_WO      |        | PASSWORD          |
| M_LOCATION     |         | CAN_ASSIGN_WO     |        | EMAIL             |
+----------------+         +-------------------+        | IS_DELETED        |
                          +-------------------+        | CAN_VIEW_STAFF_ADMIN|
                                                      +-------------------+
                                                              |
                                                              |
                                                              v
                                                      +-------------------+
                                                      |    BB_WO          |
                                                      +-------------------+
                                                      | WO_ID             |
                                                      | WO_NUMBER         |
                                                      | PROJECT           |
                                                      | WO_TYPE           |
                                                      | WO_TITLE          |
                                                      | WO_DESC           |
                                                      | WO_STATUS         |
                                                      | WO_PRIORITY       |
                                                      | WO_SPECIFICLOCATION|
                                                      | WO_ESTIMATE       |
                                                      | WO_ADDITIONAL_NOTE|
                                                      | IS_DELETED        |
                                                      | ASSIGNED_TO       |
                                                      | ASSIGNED_DATE     |
                                                      | CRE_BY            |
                                                      | CRE_DT            |
                                                      | MAX_NUMBER        |
                                                      | CLOSING_NOTES     |
                                                      | ASSIGNEE_NOTES    |
                                                      | PO_NUMBER         |
                                                      | EMAIL_TO_LIST     |
                                                      +-------------------+
                                                              |
                                                              |
                                                              v
                                                      +-------------------+
                                                      |   BB_WO_HISTORY   |
                                                      +-------------------+
                                                      | ID                |
                                                      | WO_ID             |
                                                      | WO_NUMBER         |
                                                      | PROJECT           |
                                                      | DESCRIPTION       |
                                                      | CRE_BY            |
                                                      | CRE_DT            |
                                                      | IS_DELETED        |
                                                      | ASSIGNEE_NOTES    |
                                                      | PO_NUMBER         |
                                                      | USER              |
                                                      | WO_STATUS         |
                                                      +-------------------+

+-------------------+
|     PushToken     |
+-------------------+
| id                |
| email             |
| pushToken         |
+-------------------+

+-------------------+
|     ERRORS        |
+-------------------+
| Source            |
| Description       |
| CreBy             |
| CreDt             |
+-------------------+
