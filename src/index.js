// @flow
import { debounce, isFunction, isEqual, isEmpty } from '@/utils';

type QsBinder = ({
  data: Object => Object | Object,
  dataKey: string,
  debounceLength?: number
}) => Object;

const qsBinder: QsBinder = ({ data, dataKey, debounceLength = 0 }) => {
  return {
    data() {
      return {
        [dataKey]: {
          ...(!isFunction(data) ? data : data(this.$route))
        },
        qsBinderHasMounted: false
      };
    },

    created() {
      this.qsBinderHasMounted = true;
    },

    watch: {
      [dataKey]: {
        handler: debounce(function(newValue, prevValue) {
          if (this.qsBinderHasMounted && !isEqual(newValue, prevValue)) {
            this.$router.push({
              ...this.$route,
              query: {
                ...this.$route.query,
                ...newValue
              }
            });
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

              this[dataKey] = {
                ...this[dataKey],
                ...newData
              };
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
