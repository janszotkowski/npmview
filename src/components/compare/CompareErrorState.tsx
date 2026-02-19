export const CompareErrorState = (): React.ReactElement => {
    return (
        <div className={'p-12 text-center'}>
            <p className={'text-red-700 dark:text-red-300 font-medium'}>
                Could not load one or more packages. Check names and try again.
            </p>
        </div>
    );
}
