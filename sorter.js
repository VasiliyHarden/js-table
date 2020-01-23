const NO_SORT = 0;
const ASC_SORT = 1;
const DES_SORT = 2;

class ColumnSorter {
	constructor(columnName, headerCellID, sortArrowID) {
		this.columnName = columnName;
		this.sortType = NO_SORT;
		this.arrow = document.getElementById(sortArrowID);
		this.header = document.getElementById(headerCellID);
	}
	setClickHandler(handler) {
		this.clickHandler = handler;
		this.header.addEventListener('click', (e) => {
			this._cleanClasses();
			if (this.sortType == NO_SORT || this.sortType == DES_SORT) {
				this.sortType = ASC_SORT;
				this.arrow.classList.add('asc-sort-arrow');
			} else {   // this.sort == ASC_SORT 
				this.sortType = DES_SORT;
				this.arrow.classList.add('des-sort-arrow');
			}
			handler(this.columnName, this.sortType);
		});
	}
	setNoSort() {
		this._cleanClasses();
		this.sortType = NO_SORT;
	}
	getColumnName() {
		return this.columnName;
	}
	_cleanClasses() {
		this.arrow.classList.remove('asc-sort-arrow');
		this.arrow.classList.remove('des-sort-arrow');		
	}
}