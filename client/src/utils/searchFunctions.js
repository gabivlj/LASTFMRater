/**
 * We use this class for the Search page component. We'll reuse this for handling the search and not repeat
 * ourselves using a function.
 */

class Search {
  /**
   * @param searchquery : String, the query from the link.
   * @param store: Store, Redux store object ((Very important))
   * @desc We use this class for the Search page component. We'll reuse this for handling the search and not repeat ourselves using a function.
   */
  constructor(searchquery, store) {
    this.searchquery = searchquery;
    this.store = store;
  }
  /**
   * @param type : String, what attribute in the searchData will change
   * @param itemsCount : Number, how many items do you want to bring up to the list
   * @param propFunction : Func, what action function do you wanna use, remember that it must be (searchquery, itemsCount, page) structured.
   * @param page(optional) : Number, what page do you wanna get. It's 1 by default.
   * @desc Finds any category like playlist, albums, or artists and it will automatically put them in the REDUX state fine.
   */

  search(type, itemsCount, propFunction, page = 1) {
    // First, we set the loading: true
    this.store.dispatch({ payload: type, type: 'SET_LOADING_SEARCH_PAGE' });
    // Then, we search them
    // The bad thing about this is that we will use this structure
    // for every propFunction and it will be a pity thing to remember
    // but maybe we'll be thankful in the future.
    propFunction(this.searchquery, itemsCount, page);
  }
}

export default Search;
