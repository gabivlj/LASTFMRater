module.exports = {
  /**
   * @description Adds 1 to the sum or adds a new date to the arrayOfReviews.
   */
  add: (arrayOfReviews = []) => {
    function sameDay(d1, d2) {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    }
    if (arrayOfReviews.length === 0) {
      return [{ date: Date.now(), sum: 1 }];
    }
    const lastElement = arrayOfReviews[arrayOfReviews.length - 1];
    const date = new Date(lastElement.date);
    if (sameDay(date, new Date(Date.now()))) {
      const array = [
        ...arrayOfReviews.slice(0, arrayOfReviews.length - 1),
        { date: lastElement.date, sum: lastElement.sum + 1 },
      ];
      return array;
    }
    return [...arrayOfReviews, { date: Date.now(), sum: 1 }];
  },
  /**
   * @description Substracts 1 from the sum attribute of the last date, to be honest we really do not care
   *              if the rating that is spliced wasn't from these dates, we are just gonna clamp it between 0 and whatever.
   */
  substract: (arrayOfReviews = []) => {
    if (arrayOfReviews.length === 0) return arrayOfReviews;
    const lastElement = arrayOfReviews[arrayOfReviews.length - 1];
    return [
      ...arrayOfReviews.slice(0, arrayOfReviews.length - 1),
      { date: lastElement.date, sum: Math.max(lastElement.sum - 1, 0) },
    ];
  },
};
