export const ITEM_PER_PAGE = 10;



type RouteAccessMap = {
    [key: string]: string[];
  };
  
  export const routeAccessMap: RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/student(.*)": ["student"],
    "/staff(.*)": ["staff"],
    "/parent(.*)": ["parent"],
    "/attendance(.*)": ["attendance"],
    "/list/employee": ["admin"],
    "/list/students": ["admin"],
    "/list/subjects": ["admin"],
    "/list/classes": ["admin"],
    "/list/results": ["admin", "student", "parent"],
    "/list/attendance": ["admin", "staff"],
  };