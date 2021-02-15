const TERM_TYPES = {
  LABEL: 'LABEL',
  USER: 'USER'
}

const filterByLabel = (card, term) => {
  const cardTerm = card.querySelector('.label-text')
  if (cardTerm && cardTerm.innerText === term) {
    let isHidden = false
    for (const cardClass of card.classList) {
      if (cardClass === 'trello-search-exclude-term_hide') {
        isHidden = true
        break
      }
    }
    if (isHidden) {
      card.classList.remove("trello-search-exclude-term_hide");
    } else {
      card.classList.add("trello-search-exclude-term_hide");
    }
  }
}

const filterByUser = (card, term) => {
  const cardTerm = card.querySelector('.label-text')
  if (cardTerm && cardTerm.innerText === term) {
    let isHidden = false
    for (const cardClass of card.classList) {
      if (cardClass === 'trello-search-exclude-term_hide') {
        isHidden = true
        break
      }
    }
    if (isHidden) {
      card.classList.remove("trello-search-exclude-term_hide");
    } else {
      card.classList.add("trello-search-exclude-term_hide");
    }
  }
}

const getFilter = (type) => {
  switch(type) {
    case TERM_TYPES.LABEL: return filterByLabel
    case TERM_TYPES.USER: return filterByLabel
  }
}

const findAllCards = () => {
  const cards = document.querySelectorAll('.list-card')
  return cards
}

const filterCards = (cards, term, type) => {
  cards.forEach(card => {
    const filter = getFilter(type)
    filter(card, term)
  })
}

const handleClickExclude = (term, type) => {
  return (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cards = findAllCards()
    filterCards(cards, term, type)
  }
}

const excludeIcon = (term, type) => {
  const span = document.createElement('div')
  span.className = 'trello-search-exclude-term_excludeLabel'
  span.innerHTML = 'exclude'
  span.onclick = handleClickExclude(term, type)
  return span
}

const getElementToAppend = (node, type) => {
  switch (type) {
    case TERM_TYPES.LABEL: return node.element.querySelector('.label-list-item-link-name:not(.mod-quiet)')
    case TERM_TYPES.USER: return node.element.querySelector('.full-name')
  }
}

const addExcludeIconToLabelsAndUsers = (items) => {
  items.map(item => {
    const element = getElementToAppend(item, item.type)
    if (element) {
      element.append(excludeIcon(item.term, item.type))
    }
  })
}

const findAllLabels = () => {
  const elements = document.getElementsByClassName('label-list-item')

  const labels = []
  for (let element of elements) {
    const term = element.querySelector('.label-list-item-link-name')
    if (term) {
      labels.push({
        term: term.innerText,
        element,
        type: TERM_TYPES.LABEL
      })
    }

  }
  return labels
}

const findAllUsers = () => {
  const elements = document.querySelectorAll('.item.js-member-item')

  const users = []
  for (let element of elements) {
    const term = element.querySelector('.full-name')
    if (term) {
      users.push({
        term: term.getAttribute('name'),
        element,
        type: TERM_TYPES.USER
      })
    }

  }
  console.log('users', users)
  return users
}

const main = () => {
  const labels = findAllLabels()
  const users = findAllUsers()
  addExcludeIconToLabelsAndUsers([...labels, ...users])
}

const config = { childList: true, subtree: true };


const watchForLabelListChange = () => {
  const labelList = document.querySelector('.js-filter-search-results')

  const callback = function (mutationsList, ob) {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach((node) => {
        if (node.classList[0] === 'label-list') {
          const excludeButtonsAlreadySet = document.querySelector('.trello-search-exclude-term_excludeLabel')
          if (!excludeButtonsAlreadySet) main()
        }
      })
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(labelList, config);
}

const start = () => {
  const callback = function (mutationsList, ob) {
    for (const mutation of mutationsList) {
      const labelsAreLoaded = document.querySelector('.label-list-item')
      if (labelsAreLoaded) {
        const excludeButtonsAlreadySet = document.querySelector('.trello-search-exclude-term_excludeLabel')
        if (!excludeButtonsAlreadySet) main()
        watchForLabelListChange()
        ob.disconnect()
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(document.body, config);
}

start()
