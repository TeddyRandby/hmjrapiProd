export default function psm(rules:any, reader:any, initial:any, acc:any, sorter:any) {
    let state = initial || "s";
    reader =
      reader ||
      function (datum:any) {
        return datum;
      };
    let [handlers] = parseHandlers(rules);
    return function (data:any) {
      data.sort(sorter).forEach((datum:any) => {
        if (reader(datum) != reader(initial))
          try {
            state = handlers[reader(state)][reader(datum)]({from: state, to: datum,acc: acc});
          } catch (err) {
            try {
              state = handlers["*"][reader(datum)]({from: state, to: datum,acc: acc});
            } catch (err) {
              try {
                state = handlers[reader(state)]["*"]({from: state, to: datum,acc: acc});
              } catch (err) {
                try {
                  state = handlers["*"]["*"]({from: state, to: datum,acc: acc});
                } catch (err) {
                  throw new Error(
                    "Transition from " +
                      reader(state) +
                      " to " +
                      reader(datum) +
                      " is undefined."
                  );
                }
              }
            }
          }
      });
      return acc;
    };
  }
  
  function parseHandlers(handlers:any) {
    var matchExp = / *\w+|\u002A *> *\w+|\u002A */;
    var matchStt = /\w+|\u002A/g;
    var parsedHandlers:any = {};
    Object.keys(handlers).forEach((key) => {
      var mch = key.match(matchExp);
      if (mch == null) throw new Error("Unrecognized transition");
      var stmch:any = key.match(matchStt);
      if (parsedHandlers[stmch[0]] == undefined) parsedHandlers[stmch[0]] = {};
      parsedHandlers[stmch[0]][stmch[1]] = handlers[key];
    });
    return [parsedHandlers, Object.keys(parsedHandlers)];
  }
  