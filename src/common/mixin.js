export const backTopMixin = {
    data() {
        return {
            isShowBackTop: false,
        }
    },
    methods: {
        backTopClick() {
            this.$refs.scroll.scrollTo(0, 0, 500);
        },
    },
}