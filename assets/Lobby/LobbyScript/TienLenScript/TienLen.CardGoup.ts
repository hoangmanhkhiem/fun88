import Utils from "../Script/common/Utils";

const TypeOfTurn = {
	MOT_LA: 1,
	MOT_DOI: 2,
	HAI_DOI_THONG: 12,
	SAM_CO: 3,
	SANH: 4,
	TU_QUY: 5,
	HAI_TU_QUY: 25,
	BA_DOI_THONG: 6,
	BON_DOI_THONG: 7,
	NAM_DOI_THONG: 8,
	SAU_DOI_THUONG: 9,
	SAU_DOI_THONG: 10,
	SANH_RONG: 11
}
class CardGroup {

	cards = null;
	cardsBySuits = null;

	constructor(cards) {
		this.cards = CardGroup.sortCards(cards);
		this.cardsBySuits = new Map<number, Array<any>>();
		var _cardsBySuits = this.cardsBySuits;
		cards.forEach(function (value, i) {
			if (_cardsBySuits.get(value.card) === undefined)
				_cardsBySuits.set(value.card, [value]);
			else {
				var currCards = _cardsBySuits.get(value.card);
				currCards.push(value);
			}
		});
	}

	getOrderedBySuit() {
		var newMap = new Map<number, Array<any>>(this.cardsBySuits);
		var orderedCards = [];
		//tu quy
		for (var [key, value] of newMap)
			if (value.length == 4) {
				orderedCards = orderedCards.concat(value);
				newMap.delete(key);
			}
		//3 doi thong
		for (var [key, value] of newMap)
			if (value.length >= 2) {
				var _key = CardGroup.getNextKey(key);
				if (newMap.get(_key) && newMap.get(_key).length >= 2) {
					var __key = CardGroup.getNextKey(_key);
					if (newMap.get(__key) && newMap.get(__key).length >= 2) {
						orderedCards = orderedCards.concat([value.shift(), value.shift()]);
						if (value.length <= 0)
							newMap.delete(key);
						var _value = newMap.get(_key);
						orderedCards = orderedCards.concat([_value.shift(), _value.shift()]);
						if (_value.length <= 0)
							newMap.delete(_key);
						var __value = newMap.get(__key);
						orderedCards = orderedCards.concat([__value.shift(), __value.shift()]);
						if (__value.length <= 0)
							newMap.delete(__key);
						var ___key = CardGroup.getNextKey(__key);
						if (newMap.get(___key) && newMap.get(___key).length >= 2) {
							// 4 doi thong
							var ___value = newMap.get(___key);
							orderedCards = orderedCards.concat([___value.shift(), ___value.shift()]);
							if (___value.length <= 0)
								newMap.delete(___key);
						}
						break;
					}
				}
			}

		for (var [key, value] of newMap)
			if (value.length == 3) {
				orderedCards = orderedCards.concat(value);
				newMap.delete(key);
			}
		do {
			var sequenceSuites = CardGroup.getFirstSequenceSuit([...newMap.keys()], 3);
			if (sequenceSuites) {
				sequenceSuites.forEach(function (_value, i) {
					orderedCards = orderedCards.concat([newMap.get(_value).shift()]);
					if (newMap.get(_value).length <= 0)
						newMap.delete(_value);
				});
			}
		} while (sequenceSuites)
		for (var [key, value] of newMap)
			if (value.length == 2) {
				orderedCards = orderedCards.concat(value);
				newMap.delete(key);
			}
		for (var [key, value] of newMap) {
			orderedCards = orderedCards.concat(value);
			newMap.delete(key);
		}
		return orderedCards;
	}

	getCardType() {
		var newMap = new Map<number, Array<any>>(this.cardsBySuits);
		var mapSize = newMap.size;
		var keys = [...newMap.keys()];
		switch (mapSize) {
			case 1:
				if (newMap.get(keys[0]).length == 1) return TypeOfTurn.MOT_LA;
				else if (newMap.get(keys[0]).length == 2) return TypeOfTurn.MOT_DOI;
				else if (newMap.get(keys[0]).length == 3) return TypeOfTurn.SAM_CO;
				else return TypeOfTurn.TU_QUY;
			// break;
			case 2:
				return TypeOfTurn.HAI_TU_QUY;
			// break;
			case 3:
				if (newMap.get(keys[0]).length == 1) return TypeOfTurn.SANH;
				else return TypeOfTurn.BA_DOI_THONG;
			// break;
			case 4:
				if (newMap.get(keys[0]).length == 1) return TypeOfTurn.SANH;
				else return TypeOfTurn.BON_DOI_THONG;
			// break;
			default:
				return TypeOfTurn.SANH
			// break;
		}
	}

	getSuitableCards(submitCards) {
		var submitCardGroup = new CardGroup(submitCards);
		var submitCardType = submitCardGroup.getCardType();
		var maxSubmitCard = CardGroup.getMaxCardOfCards(submitCards);
		var newMap = new Map<number, Array<any>>(this.cardsBySuits);
		switch (submitCardType) {
			case TypeOfTurn.MOT_LA:
				for (var i = 0; i < this.cards.length; i++) {
					if (CardGroup.point(this.cards[i]) > CardGroup.point(maxSubmitCard))
						return [this.cards[i]];
				}
				break;
			case TypeOfTurn.MOT_DOI:
				for (var [key, value] of newMap) {
					if (value.length == 1) continue;
					if (value.length >= 2) {
						for (var i = 0; i < value.length; i++) {
							if (CardGroup.point(value[i]) > CardGroup.point(maxSubmitCard))
								return [value.shift(), value.shift()];
						}
					}
				}
				break;
			case TypeOfTurn.SAM_CO:
				for (var [key, value] of newMap) {
					if (value.length < 3) continue;
					if (key > maxSubmitCard.card)
						return [value.shift(), value.shift(), value.shift()];
				}
				break;
			case TypeOfTurn.TU_QUY:
				for (var [key, value] of newMap) {
					if (value.length < 4) continue;
					if (key > maxSubmitCard.card)
						return [value];
				}
				for (var [key, value] of newMap)
					if (value.length >= 2) {
						var _key = CardGroup.getNextKey(key);
						if (newMap.get(_key) && newMap.get(_key).length >= 2) {
							var __key = CardGroup.getNextKey(_key);
							if (newMap.get(__key) && newMap.get(__key).length >= 2) {
								var ___key = CardGroup.getNextKey(__key);
								if (newMap.get(___key) && newMap.get(___key).length >= 2) {
									// 4 doi thong
									var orderedCards = [value.shift(), value.shift()];
									var _value = newMap.get(_key);
									orderedCards = orderedCards.concat([_value.shift(), _value.shift()]);
									var __value = newMap.get(__key);
									orderedCards = orderedCards.concat([__value.shift(), __value.shift()]);
									var ___value = newMap.get(___key);
									orderedCards = orderedCards.concat([___value.shift(), ___value.shift()]);
									return orderedCards;
								}
								break;
							}
						}
					}

				break;
			case TypeOfTurn.HAI_TU_QUY:

				break;
			case TypeOfTurn.BA_DOI_THONG:
				for (var [key, value] of newMap) {
					if (value.length < 4) continue;
					return [value];
				}
				for (var [key, value] of newMap)
					if (value.length >= 2) {
						var _key = CardGroup.getNextKey(key);
						if (newMap.get(_key) && newMap.get(_key).length >= 2) {
							var __key = CardGroup.getNextKey(_key);
							if (newMap.get(__key) && newMap.get(__key).length >= 2) {
								var orderedCards = [value.shift(), value.shift()];
								var _value = newMap.get(_key);
								orderedCards = orderedCards.concat([_value.shift(), _value.shift()]);
								var __value = newMap.get(__key);
								orderedCards = orderedCards.concat([__value.shift(), __value.shift()]);
								var maxCard = CardGroup.getMaxCardOfCards(orderedCards);
								if (CardGroup.point(maxCard) > CardGroup.point(maxSubmitCard))
									return orderedCards;
								var ___key = CardGroup.getNextKey(__key);
								if (newMap.get(___key) && newMap.get(___key).length >= 2) {
									// 4 doi thong

									var ___value = newMap.get(___key);
									orderedCards = orderedCards.concat([___value.shift(), ___value.shift()]);
									return orderedCards;
								}
								break;
							}
						}
					}
				break;
			case TypeOfTurn.BON_DOI_THONG:
				for (var [key, value] of newMap)
					if (value.length >= 2) {
						var _key = CardGroup.getNextKey(key);
						if (newMap.get(_key) && newMap.get(_key).length >= 2) {
							var __key = CardGroup.getNextKey(_key);
							if (newMap.get(__key) && newMap.get(__key).length >= 2) {
								var ___key = CardGroup.getNextKey(__key);
								if (newMap.get(___key) && newMap.get(___key).length >= 2) {
									// 4 doi thong
									var orderedCards = [value.shift(), value.shift()];
									var _value = newMap.get(_key);
									orderedCards = orderedCards.concat([_value.shift(), _value.shift()]);
									var __value = newMap.get(__key);
									orderedCards = orderedCards.concat([__value.shift(), __value.shift()]);
									var ___value = newMap.get(___key);
									orderedCards = orderedCards.concat([___value.shift(), ___value.shift()]);
									var maxCard = CardGroup.getMaxCardOfCards(orderedCards);
									if (CardGroup.point(maxCard) > CardGroup.point(maxSubmitCard))
										return orderedCards;
								}
								break;
							}
						}
					}
				break;
			case TypeOfTurn.SANH:
				var count = submitCards.length;
				return this.getSequenceSuitBySize(newMap, count, maxSubmitCard);
				break;
			default:
				break;
		}
		return null;
	}

	getSuggestionNoCards(listSelected, data, isCheck = false) {
		let listSuggestion;
		if (!isCheck) {
			listSuggestion = this.get_BON_DOI_THONG([], listSelected);
			if (listSuggestion.length > 0) {
				return listSuggestion;
			}
			listSuggestion = this.get_BA_DOI_THONG([], listSelected);
			if (listSuggestion.length > 0) {
				return listSuggestion;
			}
			listSuggestion = this.get_TU_QUY([], listSelected);
			if (listSuggestion.length > 0) {
				return listSuggestion;
			}
			listSuggestion = this.getSequenceSuitBySize([], data, listSelected);
			if (listSuggestion.length > 0) {
				return listSuggestion;
			}
			listSuggestion = this.get_SAM_CO([], listSelected);
			if (listSuggestion.length > 0) {
				return listSuggestion;
			}
		}
		else {
			listSuggestion = this.get_TU_QUY([], listSelected);
			if (listSuggestion.length > 0) {
				return listSuggestion;
			}
			listSuggestion = this.get_BON_DOI_THONG([], listSelected);
			if (listSuggestion.length > 0) {
				return listSuggestion;
			}
			listSuggestion = this.get_BA_DOI_THONG([], listSelected);
			if (listSuggestion.length > 0) {
				return listSuggestion;
			}
		}

		if (listSuggestion.length > 0) {
			return listSuggestion;
		}
		return null;
	}
	getSuggestionCards(submitCards, data, callback) {
		var submitCardGroup = new CardGroup(submitCards);
		var submitCardType = submitCardGroup.getCardType();
		 //Utils.Log("submitCards=",submitCards);
		 //Utils.Log("Submit card type=" + submitCardType);
		var maxSubmitCard = CardGroup.getMaxCardOfCards(submitCards);
		var newMap = new Map<number, Array<any>>(this.cardsBySuits);
		let listSuggestion = new Array();
		switch (submitCardType) {
			case TypeOfTurn.MOT_LA:
				if (submitCards[0].card != 2) {
					for (var i = 0; i < this.cards.length; i++) {
						if (CardGroup.point(this.cards[i]) > CardGroup.point(maxSubmitCard))
							listSuggestion.push([this.cards[i]]);
					}
				}
				else {
					return callback();
				}
				break;
			case TypeOfTurn.MOT_DOI:
				for (var [key, value] of newMap) {
					if (value.length == 1) continue;
					if (value.length >= 2) {
						for (var i = 0; i < value.length; i++) {
							if (CardGroup.point(value[i]) > CardGroup.point(maxSubmitCard))
								listSuggestion.push([value.shift(), value.shift()]);
						}
					}
				}
				break;
			case TypeOfTurn.SAM_CO:
				for (var [key, value] of newMap) {
					if (value.length < 3) continue;
					if (key > maxSubmitCard.card)
						listSuggestion.push([value.shift(), value.shift(), value.shift()]);
				}
				break;
			case TypeOfTurn.TU_QUY:
				listSuggestion = this.get_BON_DOI_THONG(submitCards);
				if (listSuggestion.length > 0)
					return listSuggestion;
				listSuggestion = this.get_TU_QUY(submitCards);
				break;
			case TypeOfTurn.HAI_TU_QUY:
				listSuggestion = this.get_TU_QUY(submitCards);
				break;
			case TypeOfTurn.BA_DOI_THONG:
				listSuggestion = this.get_BON_DOI_THONG(submitCards);
				if (listSuggestion.length > 0)
					return listSuggestion;
				listSuggestion = this.get_TU_QUY(submitCards);
				if (listSuggestion.length > 0)
					return listSuggestion;
				listSuggestion = this.get_BA_DOI_THONG(submitCards);
				break;
			case TypeOfTurn.BON_DOI_THONG:
				for (var [key, value] of newMap)
					if (value.length >= 2) {
						var _key = CardGroup.getNextKey(key);
						if (newMap.get(_key) && newMap.get(_key).length >= 2) {
							var __key = CardGroup.getNextKey(_key);
							if (newMap.get(__key) && newMap.get(__key).length >= 2) {
								var ___key = CardGroup.getNextKey(__key);
								if (newMap.get(___key) && newMap.get(___key).length >= 2) {
									// 4 doi thong
									var orderedCards = [value.shift(), value.shift()];
									var _value = newMap.get(_key);
									orderedCards = orderedCards.concat([_value.shift(), _value.shift()]);
									var __value = newMap.get(__key);
									orderedCards = orderedCards.concat([__value.shift(), __value.shift()]);
									var ___value = newMap.get(___key);
									orderedCards = orderedCards.concat([___value.shift(), ___value.shift()]);
									var maxCard = CardGroup.getMaxCardOfCards(orderedCards);
									if (CardGroup.point(maxCard) > CardGroup.point(maxSubmitCard))
										listSuggestion.push(orderedCards);
								}
								break;
							}
						}
					}
				break;
			case TypeOfTurn.SANH:
				listSuggestion = this.getSequenceSuitBySize(submitCards, data);
				break;
			default:
				break;
		}
		if (listSuggestion.length > 0) {
			return listSuggestion;
		}
		else
			return null;
	}

	getSequenceSuitBySize(submitCards, data, listSelected = null) {
		if (submitCards.length > 0) {
			let listCard = new Array();
			for (var [key, value] of new Map(this.cardsBySuits)) {
				listCard.push({ card: key, value: value });
			}
			let listTmp = new Array();
			let listSg = new Array();
			listCard.sort((a, b) => { return (a.card == 1 ? 14 : a.card) - (b.card == 1 ? 14 : b.card) });// sx tang dan;
			for (let i = 0; i < listCard.length; i++) {
				if ((listCard[i].card == 1 ? 14 : listCard[i].card) >= submitCards[0].card) {
					if (i + 1 < listCard.length && (listCard[i].card == 1 ? 14 : listCard[i].card) == (listCard[i + 1].card == 1 ? 14 : listCard[i + 1].card) - 1)
						listTmp.push(listCard[i]);
					else {
						listTmp.push(listCard[i]);
						if (listTmp.length >= submitCards.length) {
							let index = listTmp.findIndex(e => (e.value.findIndex(e2 => (e2.card == data.card && e2.face == data.face)) >= 0));
							if (index >= 0) {
								for (let i = 0; i <= listTmp.length - submitCards.length; i++) {
									let tmp = new Array();
									for (let j = i; j < i + submitCards.length; j++)
										if (listTmp[j].card == data.card)
											tmp.push(data);
										else
											tmp.push(listTmp[j].value[0]);
									listSg.push(tmp);
								}
								break;
							}
						}
						listTmp = new Array();
					}
				}
			}
			return listSg;
		}
		else if (listSelected != null) {
			if (listSelected.length >= 2) {
				let listCard = new Array();
				for (var [key, value] of new Map(this.cardsBySuits)) {
					listCard.push({ card: key, value: value });
				}
				let listTmp = new Array();
				let listSg = new Array();
				listCard.sort((a, b) => { return (a.card == 1 ? 14 : a.card) - (b.card == 1 ? 14 : b.card) });// sx tang dan;
				for (let i = 0; i < listCard.length; i++) {
					if ((listCard[i].card == 1 ? 14 : listCard[i].card) >= 3) {
						if (i + 1 < listCard.length && (listCard[i].card == 1 ? 14 : listCard[i].card) == (listCard[i + 1].card == 1 ? 14 : listCard[i + 1].card) - 1)
							listTmp.push(listCard[i]);
						else {
							listTmp.push(listCard[i]);
							if (listTmp.length >= 3) {
								let index = listTmp.findIndex(e => e.value.findIndex(e2 => (e2.card == data.card && e2.face == data.face)) >= 0);
								if (index >= 0) {
									let tmp = new Array();
									for (let j = 0; j < listTmp.length; j++) {
										if (listTmp[j].card == data.card)
											tmp.push(data);
										else if (listSelected.findIndex(e => CardGroup.indexToCard(e.index).card == listTmp[j].card) >= 0) {
											var _index = listSelected.findIndex(e => CardGroup.indexToCard(e.index).card == listTmp[j].card);
											tmp.push(CardGroup.indexToCard(listSelected[_index].index));
										} else
											tmp.push(listTmp[j].value[0]);
									}
									if (listSelected.filter(e => tmp.findIndex(e2 => (CardGroup.indexToCard(e.index).card == e2.card && CardGroup.indexToCard(e.index).face == e2.face)) >= 0).length >= 2) {
										listSg.push(tmp);
										return listSg;
									}
								}
							}
							listTmp = new Array();
						}
					}
				}
				return listSg;
			}
			else
				return [];
		}
		return [];
	}
	get_BA_DOI_THONG(submitCards, listSelected = null) {
		if (submitCards.length > 0) {
			let listCard = new Array();
			let listTmp2 = new Array();
			let listTmp = new Array();
			let listSg = new Array();
			for (var [key, value] of new Map(this.cardsBySuits)) {
				listCard.push({ card: key, value: value });
			}
			for (let i = 0; i < listCard.length; i++) {
				if (i + 1 < listCard.length
					&& CardGroup.cardRank(listCard[i].card) == CardGroup.cardRank(listCard[i + 1].card) - 1
					&& listCard[i].value.length >= 2 && listCard[i + 1].value.length >= 2) {
					listTmp.push(listCard[i]);
				}
				else {
					if (listCard[i].value.length >= 2) {
						listTmp.push(listCard[i]);
					}
					if (listTmp.length >= 3)
						listTmp2.push(listTmp);
					listTmp = new Array();
				}
			}
			for (let i = 0; i < listTmp2.length; i++) {
				for (let j = 0; j < listTmp2[i].length - 2; j++) {
					let tmp = new Array();
					for (let l = j; l < j + 3; l++) {
						for (let k = 0; k < 2; k++)
							tmp.push(listTmp2[i][l].value[k]);
					}
					listSg.push(tmp);
				}
			}
			return listSg;
		}
		else {
			let listSg = new Array();
			if (listSelected.length >= 2) {
				let listCard = new Array();
				let listTmp2 = new Array();
				let listTmp = new Array();

				for (var [key, value] of new Map(this.cardsBySuits)) {
					listCard.push({ card: key, value: value });
				}
				for (let i = 0; i < listCard.length; i++) {
					if (i + 1 < listCard.length
						&& CardGroup.cardRank(listCard[i].card) == CardGroup.cardRank(listCard[i + 1].card) - 1
						&& listCard[i].value.length >= 2 && listCard[i + 1].value.length >= 2) {
						listTmp.push(listCard[i]);
					}
					else {
						if (listCard[i].value.length >= 2) {
							listTmp.push(listCard[i]);
						}
						if (listTmp.length >= 3)
							listTmp2.push(listTmp);
						listTmp = new Array();
					}
				}
				for (let i = 0; i < listTmp2.length; i++) {
					for (let j = 0; j < listTmp2[i].length - 2; j++) {
						let tmp = new Array();
						for (let l = j; l < j + 3; l++) {
							for (let k = 0; k < 2; k++)
								tmp.push(listTmp2[i][l].value[k]);
						}
						if (listSelected.filter(e => tmp.findIndex(e2 => (CardGroup.indexToCard(e.index).card == e2.card && CardGroup.indexToCard(e.index).face == e2.face)) >= 0).length >= 2) {
							listSg.push(tmp);
							return listSg;
						}

					}
				}
			}
			return listSg;
		}
	}
	get_BON_DOI_THONG(submitCards, listSelected = null) {
		if (submitCards.length > 0) {
			let listCard = new Array();
			let listTmp2 = new Array();
			let listTmp = new Array();
			let listSg = new Array();
			for (var [key, value] of new Map(this.cardsBySuits)) {
				listCard.push({ card: key, value: value });
			}
			for (let i = 0; i < listCard.length; i++) {
				if (i + 1 < listCard.length
					&& CardGroup.cardRank(listCard[i].card) == CardGroup.cardRank(listCard[i + 1].card) - 1
					&& listCard[i].value.length >= 2 && listCard[i + 1].value.length >= 2) {
					listTmp.push(listCard[i]);
				}
				else {
					if (listCard[i].value.length >= 2) {
						listTmp.push(listCard[i]);
					}
					if (listTmp.length >= 3)
						listTmp2.push(listTmp);
					listTmp = new Array();
				}
			}
			for (let i = 0; i < listTmp2.length; i++) {
				for (let j = 0; j < listTmp2[i].length - 3; j++) {
					let tmp = new Array();
					for (let l = j; l < j + 4; l++) {
						for (let k = 0; k < 2; k++)
							tmp.push(listTmp2[i][l].value[k]);
					}
					listSg.push(tmp);
				}
			}
			return listSg;
		}
		else {
			let listSg = new Array();
			if (listSelected.length >= 2) {
				let listCard = new Array();
				let listTmp2 = new Array();
				let listTmp = new Array();
				for (var [key, value] of new Map(this.cardsBySuits)) {
					listCard.push({ card: key, value: value });
				}
				for (let i = 0; i < listCard.length; i++) {
					if (i + 1 < listCard.length
						&& CardGroup.cardRank(listCard[i].card) == CardGroup.cardRank(listCard[i + 1].card) - 1
						&& listCard[i].value.length >= 2 && listCard[i + 1].value.length >= 2) {
						listTmp.push(listCard[i]);
					}
					else {
						if (listCard[i].value.length >= 2) {
							listTmp.push(listCard[i]);
						}
						if (listTmp.length >= 3)
							listTmp2.push(listTmp);
						listTmp = new Array();
					}
				}
				for (let i = 0; i < listTmp2.length; i++) {
					for (let j = 0; j < listTmp2[i].length - 3; j++) {
						let tmp = new Array();
						for (let l = j; l < j + 4; l++) {
							for (let k = 0; k < 2; k++)
								tmp.push(listTmp2[i][l].value[k]);
						}
						if (listSelected.filter(e => tmp.findIndex(e2 => (CardGroup.indexToCard(e.index).card == e2.card && CardGroup.indexToCard(e.index).face == e2.face)) >= 0).length >= 2) {
							listSg.push(tmp);
							return listSg;
						}

					}
				}
			}
			return listSg;
		}
	}
	get_TU_QUY(submitCards, listSelected = null) {
		if (submitCards.length > 0) {
			let listSg = new Array();
			for (var [key, value] of new Map<number, Array<any>>(this.cardsBySuits)) {
				if (value.length == 4) {
					listSg.push(value);
				}
			}
			return listSg;
		}
		else {
			let listSg = new Array();
			if (listSelected.length >= 2) {
				for (var [key, value] of new Map<number, Array<any>>(this.cardsBySuits)) {
					if (value.length == 4 && listSelected.filter(e => value.findIndex(e2 => (CardGroup.indexToCard(e.index).card == e2.card && CardGroup.indexToCard(e.index).face == e2.face)) >= 0).length >= 2) {
						listSg.push(value);
						return listSg;
					}
				}
			}
			return listSg;
		}
	}
	get_SAM_CO(submitCards, listSelected = null) {
		let listSg = new Array();
		if (listSelected.length >= 2) {

			for (var [key, value] of new Map<number, Array<any>>(this.cardsBySuits)) {
				let tmp = new Array();
				if (value.length < 3) continue;
				if (key > 2) {
					tmp = [value.shift(), value.shift(), value.shift()];
					if (listSelected.filter(e => tmp.findIndex(e2 => (CardGroup.indexToCard(e.index).card == e2.card && CardGroup.indexToCard(e.index).face == e2.face)) >= 0).length >= 2) {
						listSg.push(tmp);
					}
					return listSg;
				}

			}
		}
		return listSg;
	}

	static getMaxCardOfCards(cards) {
		return CardGroup.sortCards(cards)[cards.length - 1];
	}

	static getNextKey(key) {
		return key == 13 ? 1 : key + 1;
	}

	static subCards(cards, subCards) {
		return cards.filter(function (value) {
			var found = false;
			subCards.forEach(function (_value, i) {
				if (value.card == _value.card
					&& value.face == _value.face) {
					found = true;
					return;
				}
			});
			return !found;
		});
	}
	static sortSuits(suits) {
		suits.sort(function (a, b) {
			return (a + 10) % 13 - (b + 10) % 13;
		})
	}
	static sortCards(cards) {
		return cards.sort(function (a, b) {
			return CardGroup.point(a) - CardGroup.point(b);
		})
	}

	static point(card) {
		return (card.card + 10) % 13 * 4 + card.face;
	}

	static getFirstSequenceSuit(suits, minCount) {
		if (!suits)
			return null;
		if (minCount <= 1 || minCount > suits.length)
			return null;
		var _suits = [...suits];
		CardGroup.sortSuits(_suits);
		var temp = [];
		do {
			var curr = _suits.shift()
			if (curr == 2)
				break;
			if (temp.length > 0
				&& ((curr != 1 && (curr - temp[temp.length - 1] > 1))
					|| curr == 1 && temp[temp.length - 1] != 13)) {
				if (temp.length >= minCount)
					return temp;
				temp = [];
			}
			temp.push(curr);
		}
		while (_suits.length != 0);

		if (temp.length >= minCount)
			return temp;
		return null;
	}

	static getFirstSequenceSuitBySize(map, count, maxCard) {
		if (!map)
			return null;
		if (count <= 1 || count > map.length)
			return null;
		var _suits = [...map.keys()];
		CardGroup.sortSuits(_suits);
		var temp = [];
		for (var i = 0; i < _suits.length - 1; i++) {
			var curr = _suits[i];
			var next = _suits[i + 1];
			if (curr == 1) {
				var listCards = map.get(curr);
				for (let j = 0; j < listCards.length; j++) {
					if (CardGroup.point(listCards[j]) > CardGroup.point(maxCard)) {
						temp.push(listCards[j]);
						// return temp;
					}
				}
			}
			if (curr < maxCard.card - count) {
				map.delete(curr);
				continue;
			}

			if (curr == 2 || next == 2)
				break;
			else if (temp.length == count - 1) {
				var listCards = map.get(curr);
				for (let j = 0; j < listCards.length; j++) {
					if (CardGroup.point(listCards[j]) > CardGroup.point(maxCard)) {
						temp.push(listCards[j]);
						// return temp;
					}
				}
				map.delete(_suits.shift());
				return CardGroup.getFirstSequenceSuitBySize(map, count, maxCard);
			}
			else if ((next - curr) == 1 || (next == 1 && curr == 13)) {
				var listCards = map.get(curr);
				temp.push(listCards[0]);
			}
			else {
				map.delete(_suits.shift());
				temp.push(CardGroup.getFirstSequenceSuitBySize(map, count, maxCard));
			};
		}
		if (temp.length == count)
			return temp;
		return null;
	}

	static cardRank(card) {
		return (card + 10) % 13;
	}

	static indexToCard(index) {
		var face = index + 1;
		while (face > 4)
			face -= 4;
		var card = (index + 1 - face) / 4 + 3;
		if (card > 13) card -= 13;
		return { card: card, face: face };
	}

	static indexsToCards(indexs) {
		var cards = [];
		indexs.forEach(index => {
			cards.push(CardGroup.indexToCard(index));
		});
		return cards;
	}

	static cardsToIndexs(cards) {
		var indexs = [];
		cards.forEach(card => {
			indexs.push(CardGroup.cardToIndex(card));
		});
		return indexs;
	}

	static cardToIndex(card) {
		return (card.card + 10) % 13 * 4 + card.face - 1;
	}
}
export default CardGroup;