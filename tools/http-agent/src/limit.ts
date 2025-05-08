import pLimit from 'p-limit';

export  class  HTTPLimit {
  private static _limit =  pLimit(10);

  public static update(limit: number)  {
	this._limit = pLimit(limit)
  }

  public static get limit() {
  	return this._limit
  }
}