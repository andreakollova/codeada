self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/auth\\/callback(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/auth/callback"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()