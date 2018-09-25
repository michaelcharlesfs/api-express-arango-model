var express = require('express');
var router = express.Router();
var filter = {
    nameCollection: '',
    nameDocument: ''
}

filter.catchParams = function(collection, document, params) {
	filter.nameCollection = collection;
	filter.nameDocument = document;
	let result = '';
    let paramsSort = '';
    let paramsPaging = '';
    if (params.sort !== undefined) {
        paramsSort = params.sort;
        delete params.sort;
    }
    if (params.paging !== undefined) {
        paramsPaging = params.paging;
        delete params.paging;
    }
    if (params.filter === undefined || params.filter === 'simple') {
        delete params.filter;
        result = simpleParams(params);
    } else if (params.filter !== undefined && params.filter === 'complex') {
        delete params.filter;
        result = complexParams(params);
    }
    result = result + sortData(paramsSort);
    result = result + pagingData(paramsPaging);
	return result;
}

function simpleParams(params) {
    let arrayKeys = Object.keys(params);
    let queryFilter = '';
    for (let key of arrayKeys) {
        queryFilter = queryFilter + ` FILTER ${filter.nameDocument}.${key} == '${params[key]}'`;
    }
    return queryFilter;
}

function complexParams(params) { 
    let arrayKeys = Object.keys(params);
    let queryFilter = '';
    for (let key of arrayKeys) {
        let object = params[key].substring(1, params[key].length-1).split(',');
        if (object[0] === 'contains' || object[0] === 'CONTAINS') {
            queryFilter = queryFilter + ` FILTER CONTAINS(${filter.nameDocument}.${key},'${object[1]}')`;
        } else if (object[0] === 'equals' || object[0] === 'EQUALS') {
            queryFilter = queryFilter + ` FILTER ${filter.nameDocument}.${key} == '${object[1]}'`;
        } else if (object[0] === '>' || object[0] === '<' || object[0] === '<=' || object[0] === '>=' || object[0] === '!=') {
            queryFilter = queryFilter + ` FILTER ${filter.nameDocument}.${key} ${object[0]} ${object[1]}`;
        } else if (object[0] === '=') {
            queryFilter = queryFilter + ` FILTER ${filter.nameDocument}.${key} == ${object[1]}`;
        }
    }
    return queryFilter;
}

function sortData(params) {
    let object = params.substring(1, params.length-1).split(',');
    let datas = object[0].split(';');
    let dataFormated = [];
    for (let data of datas) {
        dataFormated.push(`${filter.nameDocument}.${data}`);
    }
    datas = dataFormated.join(',');
    let querySort = ` SORT ${datas} ${object[1]}`;
    return querySort;
}

function pagingData(params) {
    let queryPaging = '';
    if (params !== '') {
        let object = params.substring(1, params.length-1).split(',');
        if (object.length === 1) {
            queryPaging = ` LIMIT ${object[0]}`;       
        } else if (object.length === 2) {
            queryPaging = ` LIMIT ${object[0]},${object[1]}`;   
        }
    }
    return queryPaging;
}

/*module.exports = (collection, document) => {
    filter.nameCollection = collection;
    filter.nameDocument = document;
    return filter;
};*/
module.exports = filter;