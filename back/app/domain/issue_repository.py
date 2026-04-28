from abc import ABC, abstractmethod

from app.domain.issues import Issues


class IssueRepository(ABC):
    @abstractmethod
    def create(self, issue: Issues) -> Issues:
        pass

    @abstractmethod
    def find_by_id(self, id: str) -> Issues | None:
        pass

    @abstractmethod
    def update_answer(self, id: str, answer: str) -> None:
        pass

    @abstractmethod
    def update_judgment(self, id: str, judgment: str) -> None:
        pass
