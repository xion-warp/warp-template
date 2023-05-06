use std::marker::PhantomData;

use cosmwasm_std::testing::{MockApi, MockQuerier, MockStorage, MOCK_CONTRACT_ADDR};
use cosmwasm_std::{Binary, Coin, ContractResult, OwnedDeps as CwOwnedDeps, SystemResult};

use crate::ArchwayQuery;

pub type MockOwnedDeps = CwOwnedDeps<MockStorage, MockApi, MockQuerier<ArchwayQuery>, ArchwayQuery>;

pub trait MockDepsExt {
    fn with_archway_query_handler<F>(self, handler: F) -> Self
    where
        F: Fn(&ArchwayQuery) -> ContractResult<Binary> + 'static;
}

impl MockDepsExt for MockOwnedDeps {
    fn with_archway_query_handler<F>(self, handler: F) -> Self
    where
        F: Fn(&ArchwayQuery) -> ContractResult<Binary> + 'static,
    {
        let querier = self
            .querier
            .with_custom_handler(move |q| SystemResult::Ok(handler(q)));

        Self { querier, ..self }
    }
}

pub fn mock_dependencies<F>(custom_handler: F) -> MockOwnedDeps
where
    F: Fn(&ArchwayQuery) -> ContractResult<Binary> + 'static,
{
    mock_dependencies_with_balance(&[], custom_handler)
}

pub fn mock_dependencies_with_balance<F>(
    contract_balance: &[Coin],
    custom_handler: F,
) -> MockOwnedDeps
where
    F: Fn(&ArchwayQuery) -> ContractResult<Binary> + 'static,
{
    let custom_querier: MockQuerier<ArchwayQuery> =
        MockQuerier::new(&[(MOCK_CONTRACT_ADDR, contract_balance)]);

    MockOwnedDeps {
        storage: MockStorage::default(),
        api: MockApi::default(),
        querier: custom_querier,
        custom_query_type: PhantomData,
    }
    .with_archway_query_handler(custom_handler)
}
