const ADD_FORM = 0;
const FILTER_FORM = 1;
  
class TableFooter {
  constructor(domFooter) {
    this.domFooter = domFooter;
  }
  renderFilterInfo(template) {
    this.domFooter.innerHTML = (
      `<tr>
        <td>
          Current filter:
        </td>
        <td colspan="2">
          '<mark>${template}</mark>'
        </td>
        <td>
          <button data-delete>Clear</button>
        </td>
      </tr>`
    );
  }
  // set click-handler on a Clear-button
  setClickHandler(handler) {
    this.domFooter.addEventListener('click', (e) => {
      if (event.target.tagName === 'BUTTON'){
        this._clearFilterInfo();
        handler();
      }
    });   
  }
  // destroy the footer content
  _clearFilterInfo() {
    this.domFooter.innerHTML = '';
  }
}

class TableBody {
  constructor(domTable) {
    this.domTable = domTable;

    this.items = [];
    this.columnSorters = [];

    this.filterTemplate = '';
    
    // handle Edit/Delete button clicks
    this.domTable.addEventListener('click', (e) => {
      if (event.target.tagName === 'BUTTON'){
        if (event.target.dataset.hasOwnProperty('edit')) {
          this._updateItem(event.target.dataset.id);
        } else {  // delete
          this._deleteItem(event.target.dataset.id);
        }
      }
    });
  }

  render(items) {
    this.domTable.innerHTML = items.map((item) => {
      return (
        `<tr>
          <td>${item.getName()}</td>
          <td>${item.getCount()}</td>
          <td>${item.getFormattedPrice()}</td>
          <td>
            <button data-id=${item.getID()} data-edit>Edit</button>
            <button data-id=${item.getID()} data-delete>Delete</button>
          </td>
        </tr>`
      );
    }).join('\n');
  }

  // add/update-form submit handler
  addItemHandler(item) {
    // Delete item copy after update
    // Bad solution for huge data
    this.items = this.items.filter((_item) => {
      return _item.getID() != item.getID();
    });

    this.items.push(item);
    this.render(this.filter(this.items));

    this.columnSorters.forEach((sorter) => {
      sorter.setNoSort();
    });
  }

  // filter items by name according to this.filterTemplate
  filter(items) {
    return items.filter( (item) => {
      return item.getName().toLowerCase().includes(this.filterTemplate);
    });
  }

  // filter-form submit handler
  setFilterTemplate(template) {
    if (template) {
      this.filterTemplate = template.toLowerCase();
      // render only items matching template
      this.render(this.filter(this.items));
      this.footer.renderFilterInfo(template);     
    }

  }

  // link forms with table body
  setForm(form, type) {
    if (type == ADD_FORM) {
      this.addItemForm = form;
      this.addItemForm.setSubmitHandler(this.addItemHandler.bind(this));      
    } else {    // type == FILTER_FORM
      this.filterForm = form;
      this.filterForm.setSubmitHandler(this.setFilterTemplate.bind(this));
    }
  }

  setColumnSorter(columnName, headerCellID, sortArrowID) {
    this.columnSorters.push(new ColumnSorter(columnName, headerCellID, sortArrowID));
    this.columnSorters[this.columnSorters.length - 1].setClickHandler(this.sort.bind(this));
  }

  // link table body and footer
  setFooter(footer) {
    this.footer = footer;
    this.footer.setClickHandler(this._clearTemplate.bind(this));
  }

  // sort "button" click handler
  sort(columnName, sortType) {
    if (sortType == ASC_SORT) {
      this.items.sort((a, b) => {
        if (a[columnName] <= b[columnName]) {
          return -1;
        } 
        return 1;
      });
    } else {      // sortType == DES_SORT
      this.items.sort((a, b) => {
        if (a[columnName] > b[columnName]) {
          return -1;
        } 
        return 1;
      });
    }
    this.columnSorters.forEach((sorter) => {
      if (sorter.getColumnName() !== columnName) {
        sorter.setNoSort();
      }
    });
    this.render(this.filter(this.items));
  }

  _deleteItem(id) {
    this.items = this.items.filter((item) => item.getID() != id)
    this.render(this.filter(this.items));
  }

  _updateItem(id) {
    this.addItemForm.loadItem(this.items.find((item) => {
      return item.getID() == id;
    }));
  }

  _clearTemplate() {
    this.filterTemplate = '';
    this.render(this.filter(this.items));
  }
}

let table = new TableBody(
  document.getElementById('table-body')
);

table.setFooter(
  new TableFooter(
    document.getElementById('table-footer')
  )
);

table.setForm(
  new AddItemForm(
    document.getElementById('add-form'),
    {
      name: document.getElementById('item-name'),
      count: document.getElementById('item-count'),
      price: document.getElementById('item-price')
    },
    {
      submit: document.getElementById('submit-button'),
      addNew: document.getElementById('add-new-button')
    },
    {
      name: document.getElementById('name-field-error-message')
    }
  ), 
  ADD_FORM
);

table.setForm(
  new FilterForm(
    document.getElementById('filter-form'),
    {
      template: document.getElementById('filter-template')
    }
  ), 
  FILTER_FORM
);

table.setColumnSorter('name', 'name-column-header', 'name-sort-arrow');
table.setColumnSorter('price', 'price-column-header', 'price-sort-arrow');