const ADD = 0;
const UPDATE = 1;

// common code for both forms
class Form {
  constructor(domForm, fields) {
    this.domForm = domForm;
    this.fields = fields;
  }
  setSubmitHandler(handler) {
    this.domForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(this._fetchData())
      this._clear();
    });
  }
}

class FilterForm extends Form {
  _fetchData() {
    return this.fields.template.value.trim();
  }
  _clear() {
    this.fields.template.value = '';
  }
}

class AddItemForm extends Form {
  constructor(domForm, fields, buttons, errorFields) {
    super(domForm, fields);
    this.isUpdating = false;
    this.itemToUpdate = null;
    
    this.errorFields = errorFields;
    this.buttons = buttons;
    this.buttons.addNew.addEventListener('click', (e) => {
      if (this.isUpdating) {
        this._clear();
      }
    });

    this._setInputFilter(this.fields.count, (value) => {
      return /^[1-9]\d*$/.test(value) || /^0?$/.test(value);
    }); 

    this._setInputFilter(this.fields.price, (value) => {
      return /^[1-9]\d*[.]?\d{0,2}$/.test(value) || 
             /^0?[.]\d{0,2}$/.test(value) ||
             /^0?$/.test(value); 
    });

    this.fields.name.addEventListener('blur', (e) => {
      this._validateNameField();
    });

    this.fields.name.addEventListener('focus', (e) => {
      this._clearErrorState('name');
    });
  }

  setSubmitHandler(handler) {
    this.domForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this._validateNameField()) {
        handler(this._fetchData());
        this._clear();
      }
    });
  }

  // write data from Item object into input fields
  loadItem(item) {
    this._clearErrorState('name');
    this.isUpdating = true;
    this.itemToUpdate = item;
    this._setTextContent(UPDATE);
    
    this.fields.name.value = item.getName();
    this.fields.count.value = item.getCount();
    this.fields.price.value = item.getPrice();      
  }

  // read data from input fields and return it as an Item object
  _fetchData() {
    if (this.isUpdating) {
      this.itemToUpdate.setName(this.fields.name.value);
      this.itemToUpdate.setCount(this.fields.count.value);
      this.itemToUpdate.setPrice(this.fields.price.value);
      return this.itemToUpdate;
    }
    return (
      new Item(
        this.fields.name.value,
        this.fields.count.value,
        this.fields.price.value
      )
    );
  }

  // switch submit button text to "Add"/"Update"
  _setTextContent(mode) {
    if (mode == UPDATE) {
      this.buttons.submit.textContent = 'Update';
    } else {  // mode == ADD
      this.buttons.submit.textContent = 'Add';
    }
  }

  _clear() {
    this.fields.name.value = '';
    this.fields.count.value = '';
    this.fields.price.value = ''; 
    this.isUpdating = false;
    this.itemToUpdate = null; 
    this._setTextContent(ADD);
    this._clearErrorState('name');
  }

  // allows only given sequences to type into input fields
  _setInputFilter(field, inputFilter) {
    ["input", "select"].forEach( (e) => {
      field.addEventListener(e, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    });
  }

  _clearErrorState(field) {
    this.errorFields[field].innerText = '';
    this.fields[field].classList.remove('input-error');
  } 

  _validateNameField() {
    if (this.fields.name.value.trim() == '') {
      this.errorFields.name.innerText = 'Required field';
      this.fields.name.classList.add('input-error');
      return false;
    }
    if (this.fields.name.value.length > 15) {
      this.errorFields.name.innerText = 'Maximum length 15 characters';
      this.fields.name.classList.add('input-error');
      return false;
    }
    this._clearErrorState('name');
    return true;
  }
}

