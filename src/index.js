// @flow
import { debounce, isFunction, isEqual, isEmpty, pickBy } from '@/utils';

type QsBinder = ({
  data: Object => Object | Object,
  dataKey: string,
  debounceLength?: number,
  didUpdate?: Object => void,
  updateDataMethodName?: string
}) => Object;

const getUpdatedValues = (
  newData: Object,
  previousData: Object,
  queryData: Object
): Object =>
  pickBy(
    newData,
    (value, key) =>
      !isEqual(value, previousData[key]) && !isEqual(value, queryData[key])
  );

const qsBinder: QsBinder = ({
  data,
  dataKey,
  debounceLength = 0,
  didUpdate,
  updateDataMethodName = 'updateQsData'
}) => {
  const formatData = (input, param) => (isFunction(data) ? data(param) : input);

  return {
    data() {
      return {
        [dataKey]: formatData(data, this.$route),
        qsBinderHasMounted: false,
        qsBinderIsSilent: false
      };
    },

    created() {
      this.qsBinderHasMounted = true;
    },

    methods: {
      qsBinderDidUpdate() {
        if (typeof didUpdate === 'function') {
          didUpdate(this);
        }
      },

      [updateDataMethodName](newData, silent = false) {
        if (silent) {
          this.qsBinderIsSilent = true;
        }

        this[dataKey] = {
          ...this[dataKey],
          ...newData
        };
      }
    },

    watch: {
      [dataKey]: {
        handler: debounce(function(newValue, prevValue) {
          if (this.qsBinderIsSilent) {
            this.qsBinderIsSilent = false;
            return;
          }

          const { query, ...$route } = this.$route;

          if (this.qsBinderHasMounted && !isEqual(newValue, prevValue)) {
            const updatedValues = getUpdatedValues(newValue, prevValue, query);

            if (!isEmpty(updatedValues)) {
              this.$router.push({
                ...$route,
                query: {
                  ...query,
                  ...updatedValues
                }
              });
            }

            this.qsBinderDidUpdate();
          }
        }, debounceLength),
        deep: true
      },

      $route: {
        handler(newRoute, oldRoute) {
          if (
            !isEqual(newRoute.query, oldRoute.query) &&
            !isEqual(newRoute.query, this[dataKey])
          ) {
            if (!isEmpty(newRoute.query)) {
              const newData = formatData(newRoute.query, newRoute);

              const resetItems = Object.keys(oldRoute.query).reduce(
                (acc, key) => {
                  if (!newData[key] && this[dataKey].hasOwnProperty(key)) {
                    const defaultValue = formatData(data, newRoute)[key];

                    return {
                      ...acc,
                      [key]: defaultValue
                    };
                  }

                  return acc;
                },
                {}
              );

              this[updateDataMethodName](resetItems, true);
              this[updateDataMethodName](newData);
            } else {
              this[updateDataMethodName](formatData(data, newRoute), true);
            }
          }
        },
        deep: true
      }
    }
  };
};

export default qsBinder;
