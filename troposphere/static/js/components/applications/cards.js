define(
  [
    './Rating.react',
    './Tags.react',
    './ApplicationCard.react',
    './ApplicationCardList.react'
  ],
  function (Rating, Tags, ApplicationCard, ApplicationCardList) {

    return {
      "ApplicationCardList": ApplicationCardList,
      "ApplicationCard": ApplicationCard,
      "Rating": Rating,
      "Tags": Tags
    };

  });
