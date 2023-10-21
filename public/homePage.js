"use strict";

// Exit Button
const logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout(response => {
    if (response.success) {
      location.reload();
    }
  });
};

// User info getting.
ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

// Currency rate getting
const ratesBoard = new RatesBoard();
function currenyRateRequest() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
  
  setTimeout(currenyRateRequest, 60000);
}
currenyRateRequest();

// Money operations
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = request => {
  ApiConnector.addMoney(request, result => {
    if (result.success) {
      moneyManager.setMessage(result.success, 'Успешно добавлено!');
      ProfileWidget.showProfile(result.data);
    } else {
      moneyManager.setMessage(result.success, result.error);
    }
  });
};

moneyManager.conversionMoneyCallback = request => {
  ApiConnector.convertMoney(request, (result) => {
    if (result.success) {
      moneyManager.setMessage(result.success, 'Конвертация успешно выполнена!');
      ProfileWidget.showProfile(result.data);
    } else {
      moneyManager.setMessage(result.success, result.error);
    }
  });
};

moneyManager.sendMoneyCallback = request => {
  ApiConnector.transferMoney(request, (result) => {
    if (result.success) {
      moneyManager.setMessage(result.success, 'Перевод средств успешно выполнен!');
      ProfileWidget.showProfile(result.data);
    } else {
      moneyManager.setMessage(result.success, result.error);
    }
  });
}

// Favorite operations
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

favoritesWidget.addUserCallback = request => {
  ApiConnector.addUserToFavorites(request, result => {
    if (result.success) {console.log(request);
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(result.data);
      moneyManager.updateUsersList(result.data);
      favoritesWidget.setMessage(result.success, 'Абонент успешно добавлен!');
    } else {
      favoritesWidget.setMessage(result.success, result.error);
    }
  });
};

favoritesWidget.removeUserCallback = request => {
  ApiConnector.removeUserFromFavorites(request, result => {
    if (result.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(result.data);
      moneyManager.updateUsersList(result.data);
      favoritesWidget.setMessage(result.success, 'Абонент успешно удалён!');
    } else {
      favoritesWidget.setMessage(result.success, result.error);
    }
  });
};