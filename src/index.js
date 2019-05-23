// @flow
import { debounce, isFunction, isEqual, isEmpty } from '@/utils';

type QsBinder = ({
  data: Object => Object | Object,
  dataKey: string,
  debounceLength?: number,
  didUpdate?: Object => void,
  updateDataMethodName?: string
}) => Object;

const qsBinder: QsBinder = ({
  data,
  dataKey,
  debounceLength = 0,
  didUpdate,
  updateDataMethodName = 'updateQsData'
}) => {
  return {
    data() {
      return {
        [dataKey]: !isFunction(data) ? data : data(this.$route),
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
            if (!isEqual(newValue, query)) {
              this.$router.push({
                ...$route,
                query: {
                  ...query,
                  ...newValue
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
              const newData = !isFunction(data)
                ? newRoute.query
                : data(newRoute);

              this[updateDataMethodName](newData);
            } else {
              this[dataKey] = {};
            }
          }
        },
        deep: true
      }
    }
  };
};

export default qsBinder;
