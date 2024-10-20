var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* main.ts */
console.log("JavaScript файл загружен и выполняется");
var API_URL = 'http://localhost:3000/api';
// Получение структуры файлов
function fetchFileStructure() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Получение структуры файлов');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/files"))];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Ошибка сети при получении структуры файлов');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log('Структура файлов:', data); // Логируем данные для проверки
                    renderFileTree(data);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Ошибка при получении структуры файлов:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Создание папки
function createFolder() {
    return __awaiter(this, void 0, void 0, function () {
        var folderName, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Создание папки');
                    folderName = prompt('Введите имя папки:');
                    if (!folderName) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/folder"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ parentPath: '', folderName: folderName }),
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        alert('Папка создана');
                        fetchFileStructure(); // Обновить структуру файлов
                    }
                    else {
                        alert('Ошибка создания папки');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Ошибка при создании папки:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Загрузка файла
function uploadFile() {
    return __awaiter(this, void 0, void 0, function () {
        var input;
        var _this = this;
        return __generator(this, function (_a) {
            console.log("Функция загрузки файла вызвана");
            input = document.createElement('input');
            input.type = 'file';
            input.onchange = function () { return __awaiter(_this, void 0, void 0, function () {
                var file, formData, response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            file = input.files ? input.files[0] : null;
                            if (!file) return [3 /*break*/, 4];
                            formData = new FormData();
                            formData.append('file', file);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fetch("".concat(API_URL, "/upload"), {
                                    method: 'POST',
                                    body: formData,
                                })];
                        case 2:
                            response = _a.sent();
                            if (response.ok) {
                                alert('Файл успешно загружен');
                                fetchFileStructure(); // Обновить структуру файлов
                            }
                            else {
                                alert('Ошибка при загрузке файла');
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            console.error('Ошибка при загрузке файла:', error_3);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); };
            input.click();
            return [2 /*return*/];
        });
    });
}
// Скачивание файла
function downloadFile() {
    return __awaiter(this, void 0, void 0, function () {
        var filename, response, blob, downloadUrl, a, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Функция скачивания файла вызвана");
                    filename = prompt('Введите имя файла для скачивания:');
                    if (!filename) return [3 /*break*/, 7];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/download/").concat(filename))];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.blob()];
                case 3:
                    blob = _a.sent();
                    downloadUrl = window.URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    return [3 /*break*/, 5];
                case 4:
                    alert('Ошибка при скачивании файла');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error('Ошибка при скачивании файла:', error_4);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Удаление элемента
function deleteItem() {
    return __awaiter(this, void 0, void 0, function () {
        var itemPath, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Удаление элемента');
                    itemPath = prompt('Введите путь элемента для удаления (например, bin):');
                    if (!itemPath) return [3 /*break*/, 4];
                    if (!confirm("\u0412\u044B \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C ".concat(itemPath, "?"))) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/item"), {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ itemPath: itemPath }),
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        alert('Элемент удален');
                        fetchFileStructure(); // Обновить структуру файлов
                    }
                    else {
                        alert('Ошибка при удалении элемента');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Ошибка при удалении элемента:', error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Переименование элемента
function renameItem() {
    return __awaiter(this, void 0, void 0, function () {
        var oldPath, newPath, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Переименование элемента');
                    oldPath = prompt('Введите текущий путь элемента для переименования (например, bin):');
                    newPath = prompt('Введите новое имя:');
                    if (!(oldPath && newPath)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/rename"), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ oldPath: oldPath, newPath: newPath }),
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        alert('Элемент переименован');
                        fetchFileStructure(); // Обновить структуру файлов
                    }
                    else {
                        alert('Ошибка при переименовании элемента');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error('Ошибка при переименовании:', error_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Функция для отображения дерева файлов с поддержкой раскрытия папок
function renderFileTree(treeData, parentElement) {
    if (parentElement === void 0) { parentElement = document.getElementById('fileTree'); }
    parentElement.innerHTML = ''; // Очищаем дерево перед повторной отрисовкой
    if (treeData.length === 0) {
        parentElement.innerHTML = '<p>Нет доступных файлов или папок</p>';
        return;
    }
    treeData.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item.name;
        li.className = item.type === 'folder' ? 'folder' : 'file';
        parentElement.appendChild(li);
        if (item.type === 'folder' && item.children && item.children.length > 0) {
            var ul_1 = document.createElement('ul');
            ul_1.style.display = 'none'; // По умолчанию вложенные элементы скрыты
            li.appendChild(ul_1);
            renderFileTree(item.children, ul_1);
            // Добавляем обработчик клика для раскрытия или закрытия папки
            li.addEventListener('click', function (e) {
                e.stopPropagation(); // Останавливаем всплытие события
                ul_1.style.display = ul_1.style.display === 'none' ? 'block' : 'none';
            });
        }
        // Добавление обработчика для выбора файла
        if (item.type === 'file') {
            li.addEventListener('click', function (e) {
                e.stopPropagation();
                alert("\u0424\u0430\u0439\u043B \u0432\u044B\u0431\u0440\u0430\u043D: ".concat(item.name));
                // Здесь можно добавить логику для отображения содержимого файла
            });
        }
    });
}
// Подключение событий к кнопкам
document.addEventListener('DOMContentLoaded', function () {
    // Загрузка структуры файлов при загрузке страницы
    console.log('DOM полностью загружен');
    fetchFileStructure();
    // Привязка событий к кнопкам
    var createFolderBtn = document.getElementById('createFolder');
    var deleteFileBtn = document.getElementById('deleteFile');
    var renameFileBtn = document.getElementById('renameFile');
    var uploadFileBtn = document.getElementById('uploadFile');
    var downloadFileBtn = document.getElementById('downloadFile');
    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', function () {
            console.log("Кнопка 'Создать папку' была нажата");
            createFolder();
        });
    }
    if (deleteFileBtn) {
        deleteFileBtn.addEventListener('click', function () {
            console.log("Кнопка 'Удалить файл' была нажата");
            deleteItem();
        });
    }
    if (renameFileBtn) {
        renameFileBtn.addEventListener('click', function () {
            console.log("Кнопка 'Переименовать файл' была нажата");
            renameItem();
        });
    }
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', function () {
            console.log("Кнопка 'Загрузить файл' была нажата");
            uploadFile();
        });
    }
    if (downloadFileBtn) {
        downloadFileBtn.addEventListener('click', function () {
            console.log("Кнопка 'Скачать файл' была нажата");
            downloadFile();
        });
    }
});
